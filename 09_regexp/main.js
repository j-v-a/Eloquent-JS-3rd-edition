// parsing an INI file with regexp to an object containing the settings with subobjects for sections
function parseINI(string) {
	// Start with an object to hold the top-level fields
	let result = {};
	let section = result;
	string.split(/\r?\n/).forEach(line => {
		let match;
		if ((match = line.match(/^(\w+)=(.*)$/))) {
			section[match[1]] = match[2];
		} else if ((match = line.match(/^\[(.*)\]$/))) {
			section = result[match[1]] = {};
		} else if (!/^\s*(;.*)?$/.test(line)) {
			throw new Error("Line '" + line + "' is not valid.");
		}
	});
	return result;
}

console.log(
	parseINI(`
name=Vasilis
[address]
city=Tessaloniki`)
);
// → {name: "Vasilis", address: {city: "Tessaloniki"}}

/*

	EXERCISE 1: Regexp golf

	Code golf is a term used for the game of trying to express a particular program in as few characters 
	as possible. Similarly, regexp golf is the practice of writing as tiny a regular expression as 
	possible to match a given pattern, and only that pattern.

	For each of the following items, write a regular expression to test whether any of the given 
	substrings occur in a string. The regular expression should match only strings containing one of the 
	substrings described. Do not worry about word boundaries unless explicitly mentioned. When your 
	expression works, see whether you can make it any smaller.

	1. car and cat
	2. pop and prop
	3.	ferret, ferry, and ferrari
	4.	Any word ending in ious
	5.	A whitespace character followed by a period, comma, colon, or semicolon
	6.	A word longer than six letters
	7.	A word without the letter e

	Refer to the table in the chapter summary for help. Test each solution with a few test strings.
	

*/

// Fill in the regular expressions

verify(/ca(r|t)/, ['my car', 'bad cats'], ['camper', 'high art']); // /ca[rt]/

verify(/pr?op/, ['pop culture', 'mad props'], ['plop']);

verify(/ferr[^u]/, ['ferret', 'ferry', 'ferrari'], ['ferrum', 'transfer A']); // /ferr(et|y|ari)/

verify(/(\b(\w)*ious\b)+/, ['how delicious', 'spacious room'], ['ruinous', 'consciousness']); // /ious\b/

verify(/ (\.|,|:|;)/, ['bad punctuation .'], ['escape the period']); // /\s[.,:;]/

verify(/\b\w{7,}\b/, ['hottentottententen'], ['no', 'hotten totten tenten']); // /\w{7,}/

verify(/\b[^\We]+\b/i, ['red platypus', 'wobbling nest'], ['earth bed', 'learning ape']);

function verify(regexp, yes, no) {
	// Ignore unfinished exercises
	if (regexp.source == '...') return;
	for (let str of yes)
		if (!regexp.test(str)) {
			console.error(`Failure to match '${str}'`);
		} else {
			console.log(`Matched '${str}' with '${regexp}' on '${regexp.exec(str)}'!`);
		}
	for (let str of no)
		if (regexp.test(str)) {
			console.error(`Unexpected match for '${str}': '${regexp.exec(str)}'`);
		} else {
			console.log(`Did not match '${str}' with '${regexp}'!`);
		}
}


/*

	EXERCISE 2: Quoting style

	Imagine you have written a story and used single quotation marks throughout to mark pieces of 
	dialogue. Now you want to replace all the dialogue quotes with double quotes, while keeping the 
	single quotes used in contractions like aren’t.

	Think of a pattern that distinguishes these two kinds of quote usage and craft a call to the replace 
	method that does the proper replacement.	

*/


let text = "'I'm the cook,' he said, 'it's my job.'";
// Change this call:
// console.log(text.replace(/A/g, "B"));

function whiteSpace(match, noSpace, spaceLeft, spaceRight) {
	if (noSpace) return '"';
	if (spaceLeft) return '" ';
	if (spaceRight) return ' "';
}

console.log(text.replace(/(^'|'$)|(' )|( ')/g, whiteSpace));
// → "I'm the cook," he said, "it's my job."
// Shorter solution:
console.log(text.replace(/(^|\W)'|'(\W|$)/g, '$1"$2'));


/*

	EXERCISE 3: Numbers again

	Write an expression that matches only JavaScript-style numbers. It must support an optional minus or 
	plus sign in front of the number, the decimal dot, and exponent notation—5e-3 or 1E10— again with an 
	optional sign in front of the exponent. Also note that it is not necessary for there to be digits in 
	front of or after the dot, but the number cannot be a dot alone. That is, .5 and 5. are valid 
	JavaScript numbers, but a lone dot isn’t.

*/


// Fill in this regular expression.
let number = /^(\+|-|)(\d+(\.\d*)?|\.\d+)([eE](\+|-|)\d+)?$/;

// Tests:
for (let str of ["1", "-1", "+15", "1.55", ".5", "5.",
		"1.3e2", "1E-4", "1e+12"
	]) {
	if (!number.test(str)) {
		console.log(`Failed to match '${str}'`);
	}
}
for (let str of ["1a", "+-1", "1.2.3", "1+1", "1e4.5",
		".5.", "1f5", "."
	]) {
	if (number.test(str)) {
		console.log(`Incorrectly accepted '${str}'`);
	}
}