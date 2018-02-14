/*
  EXCERCISE 1: The sum of a range

  The introduction of this book alluded to the following as a nice way to compute the sum of a range 
  of numbers:

  console.log(sum(range(1, 10)));
  Write a range function that takes two arguments, start and end, and returns an array containing all 
  the numbers from start up to (and including) end.

  Next, write a sum function that takes an array of numbers and returns the sum of these numbers. Run 
  the previous program and see whether it does indeed return 55.

  As a bonus assignment, modify your range function to take an optional third argument that indicates 
  the “step” value used to build up the array. If no step is given, the array elements go up by 
  increments of one, corresponding to the old behavior. The function call range(1, 10, 2) should 
  return [1, 3, 5, 7, 9]. Make sure it also works with negative step values so that range(5, 2, -1) 
  produces [5, 4, 3, 2].
*/

function range(start, end, step) {
	let rangeArray = [];
	if (!step) step = 1;
	if (step > 0) {
		for (let i = start; i <= end; i += step) {
			rangeArray.push(i);
		}
	} else {
		for (let i = start; i >= end; i += step) {
			rangeArray.push(i);
		}
	}

	return rangeArray;
}

function sum(numberArray) {
	let total = 0;
	for (let i = 0; i < numberArray.length; i++) {
		total += numberArray[i];
	}
	return total;
}

console.log(range(1, 10));
// → [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
console.log(range(5, 2, -1));
// → [5, 4, 3, 2]
console.log(sum(range(1, 10)));
// → 55

/*
  EXCERCISE 2: Reversing an array

  Arrays have a method reverse, which changes the array by inverting the order in which its elements 
  appear. For this exercise, write two functions, reverseArray and reverseArrayInPlace. The first, 
  reverseArray, takes an array as argument and produces a new array that has the same elements in 
  the inverse order. The second, reverseArrayInPlace, does what the reverse method does: it modifies 
  the array given as argument by reversing its elements. Neither may use the standard reverse method.

  Thinking back to the notes about side effects and pure functions in the previous chapter, which 
  variant do you expect to be useful in more situations? Which one is more efficient?
*/

function reverseArray(array) {
	let reverseArray = [];
	for (let element of array) {
		reverseArray.unshift(element);
	}
	return reverseArray;
}

function reverseArrayInPlace(array) {
	// swap first half with second half
	for (let i = 0; i < Math.floor(array.length / 2); i++) {
		let temp = array[i];
		array[i] = array[array.length - 1 - i];
		array[array.length - 1 - i] = temp;
	}
	return array;
}

console.log(reverseArray(['A', 'B', 'C']));
// → ["C", "B", "A"];
let arrayValue = [1, 2, 3, 4, 5];
reverseArrayInPlace(arrayValue);
console.log(arrayValue);
// → [5, 4, 3, 2, 1]

/*
  EXCERCISE 3: A list

  Objects, as generic blobs of values, can be used to build all sorts of data structures. A common 
  data structure is the list (not to be confused with array). A list is a nested set of objects, with 
  the first object holding a reference to the second, the second to the third, and so on.

  let list = {
    value: 1,
    rest: {
      value: 2,
      rest: {
        value: 3,
        rest: null
      }
    }
  };
  The resulting objects form a chain, the 'rest' binding points to the next object.

  A nice thing about lists is that they can share parts of their structure. For example, if I create 
  two new values {value: 0, rest: list} and {value: -1, rest: list} (with list referring to the 
    binding defined earlier), they are both independent lists, but they share the structure that 
    makes up their last three elements. In addition, the original list is also still a valid 
    three-element list.

  Write a function arrayToList that builds up a data structure like the previous one when given 
  [1, 2, 3] as argument, and write a listToArray function that produces an array from a list. Also 
  write the helper functions prepend, which takes an element and a list and creates a new list that 
  adds the element to the front of the input list, and nth, which takes a list and a number and 
  returns the element at the given position in the list, or undefined when there is no such element.

  If you haven’t already, also write a recursive version of nth.
*/

function prepend(element, list) {}

function nth(list, number) {}

function arrayToList(array) {}

function listToArray(list) {}

console.log(arrayToList([10, 20]));
// → {value: 10, rest: {value: 20, rest: null}}
console.log(listToArray(arrayToList([10, 20, 30])));
// → [10, 20, 30]
console.log(prepend(10, prepend(20, null)));
// → {value: 10, rest: {value: 20, rest: null}}
console.log(nth(arrayToList([10, 20, 30]), 1));
// → 20