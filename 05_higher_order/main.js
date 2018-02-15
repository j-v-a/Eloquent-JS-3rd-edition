/*
	EXERCISE 1: Flattening
	
	Use the reduce method in combination with the concat method to “flatten” an array of arrays into a 
	single array that has all the elements of the input arrays.
*/

function flattenArrays(array) {
	return array.reduce((array, currentValue) => array.concat(currentValue), []);
}

let arrays = [[1, 2, 3], [4, 5], [6]];
console.log(flattenArrays(arrays));
// → [1, 2, 3, 4, 5, 6]

/*
	EXERCISE 2: Your own loop
	
	Write a higher-order function loop that provides a way to something like a for loop statement. It 
	takes a value, a test function, an update function, and a body function. Each iteration, it first 
	runs the test function on the current loop value, and stops if that returns false. Then, it calls 
	the body function, giving it the current value. And finally, it calls the update function to create 
	a new value, and starts from the beginning.

	When defining the function, you may use a regular loop to do the actual looping.
*/

function loop(start, test, update, body) {
	for (let value = start; test(value); value = update(value)) {
		body(value);
	}
}

loop(3, n => n > 0, n => n - 1, console.log);
// → 3
// → 2
// → 1

/*
	EXERCISE 3: Everything
	
	Analogous to the some method, arrays also have an every method. This one returns true when the 
	given function returns true for every element in the array. In a way, some is a variant of the || 
	operator that can act on arrays, and every acts like the && operator.

	Implement every as a function that takes an array and a predicate function as parameters. Write two 
	versions, one using a loop and one using the some method.
*/

function every(array, predicate) {
	for (let element of array) {
		if (!predicate(element)) return false;
	}
	return true;
}

console.log(every([1, 3, 5], n => n < 10));
// → true
console.log(every([2, 4, 16], n => n < 10));
// → false
console.log(every([], n => n < 10));
// → true

function everySome(array, predicate) {
	return !array.some(element => !predicate(element));
}

console.log(everySome([1, 3, 5], n => n < 10));
// → true
console.log(everySome([2, 4, 16], n => n < 10));
// → false
console.log(everySome([], n => n < 10));
// → true

/*
	EXERCISE 4: Dominant writing direction
	
	Write a function that computes the dominant writing direction in a string of text. Remember that 
	each script object has a direction property that can be "ltr" (left-to-right), "rtl" 
	(right-to-left), or "ttb" (top-to-bottom).

	The dominant direction is the direction of a majority of the characters which have a script 
	associated with them. The characterScript and countBy functions defined earlier in the chapter are 
	probably useful here.
*/

// Given a character code, find the corresponding script (if any):
function characterScript(code) {
	for (let script of SCRIPTS) {
		if (script.ranges.some(([from, to]) => code >= from && code < to)) {
			return script;
		}
	}
	return null;
}

// The countBy function expects a collection (anything that we can loop over with for/of) and a
// grouping function. It returns an array of objects, each of which names a group and tells you the
// amount of elements that were found in that group.

function countBy(items, groupName) {
	let counts = [];
	for (let item of items) {
		let name = groupName(item);
		let known = counts.findIndex(c => c.name == name);
		if (known == -1) {
			counts.push({ name, count: 1 });
		} else {
			counts[known].count++;
		}
	}
	return counts;
}

function dominantDirection(text) {
	// Count the occurances of the different text directions
	let counted = countBy(text, char => {
		let script = characterScript(char.codePointAt(0));
		return script ? script.direction : 'none';
	}).filter(({ name }) => name != 'none');

	// Default to ltr if nothing is found
	if (counted.length == 0) return 'ltr';

	// Reduce the highest counted text direction
	return counted.reduce((a, b) => (a.count > b.count ? a : b)).name;
}

console.log(dominantDirection('Hello!'));
// → ltr
console.log(dominantDirection('Hey, مساء الخير'));
// → rtl
