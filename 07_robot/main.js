// The village of Meadowfield isn’t very big. It consists of eleven places with fourteen roads
// between them. It can be described with this array of roads:

const roads = [
	"Alice's House-Bob's House",
	"Alice's House-Cabin",
	"Alice's House-Post Office",
	"Bob's House-Town Hall",
	"Daria's House-Ernie's House",
	"Daria's House-Town Hall",
	"Ernie's House-Grete's House",
	"Grete's House-Farm",
	"Grete's House-Shop",
	'Marketplace-Farm',
	'Marketplace-Post Office',
	'Marketplace-Shop',
	'Marketplace-Town Hall',
	'Shop-Town Hall'
];

// convert the list of roads to a data structure that, for each place, tells us what can be reached
// from there.

function buildGraph(edges) {
	let graph = Object.create(null);

	function addEdge(from, to) {
		if (graph[from] == null) {
			graph[from] = [to];
		} else {
			graph[from].push(to);
		}
	}
	for (let [from, to] of edges.map(r => r.split('-'))) {
		addEdge(from, to);
		addEdge(to, from);
	}
	return graph;
}

const roadGraph = buildGraph(roads);

// Minimaly defined vilage state. Changes result in a new state instead of changing the current
// state.
class VillageState {
	constructor(place, parcels) {
		this.place = place;
		this.parcels = parcels;
	}

	move(destination) {
		//  is there a road going from the current place to the destination? If not, return the old
		// state, since this is not a valid move.
		if (!roadGraph[this.place].includes(destination)) {
			return this;
		} else {
			// creates a new state with the destination as the robot’s place. But it also needs to create a
			// new set of parcels — parcels that the robot is carrying (that are at the robot’s current
			// place) need to be moved along to the new place. And parcels that are addressed to the new
			// place need to be delivered — that is, they need to be removed from the set of undelivered
			// parcels. The call to map takes care of the moving, and the call to filter does the
			// delivering.
			let parcels = this.parcels
				.map(p => {
					if (p.place != this.place) return p;
					return {
						place: destination,
						address: p.address
					};
				})
				.filter(p => p.place != p.address);
			return new VillageState(destination, parcels);
		}
	}
}

// Parcel objects also aren’t changed when they are moved, but recreated. The move method gives us a
// new village state, but leaves the old one entirely intact.
let first = new VillageState('Post Office', [
	{
		place: 'Post Office',
		address: "Alice's House"
	}
]);
let next = first.move("Alice's House");

// The move causes the parcel to be delivered, and this is reflected in the next state. But the
// initial state still describes the situation where the robot is at the post office and the parcel
// is undelivered.
console.log(next.place);
// → Alice's House
console.log(next.parcels);
// → []
console.log(first.place);
// → Post Office

// A delivery robot looks at the world, and decides in which direction it wants to move. As such, we
// could say that a robot is a function that takes a VillageState object and returns the name of a
// nearby place.
// Because we want robots to be able to remember things, so that they can make and execute plans, we
// also pass them their memory, and allow them to return a new memory. Thus, the thing a robot
// returns is an object containing both the direction it wants to move in and a memory value that
// will be given back to it the next time it is called.

function runRobot(state, robot, memory) {
	for (let turn = 0; ; turn++) {
		if (state.parcels.length == 0) {
			console.log(`Done in ${turn} turns`);
			break;
		}
		let action = robot(state, memory);
		state = state.move(action.direction);
		memory = action.memory;
		console.log(`Moved to ${action.direction}`);
	}
}

// Naive implementation where the robot randomly visits locations so eventually all parcels will be
// collected and delivered

function randomPick(array) {
	let choice = Math.floor(Math.random() * array.length);
	return array[choice];
}

function randomRobot(state) {
	return {
		direction: randomPick(roadGraph[state.place])
	};
}

// As the naive robot ignores memory this is needed to create a new state with some parcels
VillageState.random = function(parcelCount = 5) {
	let parcels = [];
	for (let i = 0; i < parcelCount; i++) {
		let address = randomPick(Object.keys(roadGraph));
		let place;
		do {
			place = randomPick(Object.keys(roadGraph));
		} while (place == address);
		// if pickup place and deliver yadress are the same, keep delivering
		parcels.push({
			place,
			address
		});
	}
	return new VillageState('Post Office', parcels);
};

// Test run with randomRobot
runRobot(VillageState.random(), randomRobot);

// Run with a nice animation
// TODO: fix the error when running this:
// runRobotAnimation(VillageState.random(), randomRobot);

// An improvement to randomly visiting adresses is running a route that passes al adresses twice
const mailRoute = [
	"Alice's House",
	'Cabin',
	"Alice's House",
	"Bob's House",
	'Town Hall',
	"Daria's House",
	"Ernie's House",
	"Grete's House",
	'Shop',
	"Grete's House",
	'Farm',
	'Marketplace',
	'Post Office'
];

// A route following robot, using its memory. The robot keeps the rest of its route in its memory,
// and drops the first element every turn.
function routeRobot(state, memory) {
	if (memory.length == 0) {
		memory = mailRoute;
	}
	return {
		direction: memory[0],
		memory: memory.slice(1)
	};
}

// It’ll take a maximum of 26 turns (twice the 13-step route), but usually less.
runRobot(VillageState.random(), routeRobot, []);

// Implementation of a form of pathfinding where we “grow” routes from the starting point, exploring
// every reachable place that hasn’t been visited yet, until a route reaches the goal. That way,
// we’ll only explore routes that are potentially interesting, and find the shortest route (or one of
// the shortest routes, if there are more than one) to the goal.

function findRoute(graph, from, to) {
	// The exploring has to be done in the right order—the places that were reached first have to be
	// explored first. We can’t immediately explore a place as soon as we reach it, because that would
	// mean places reached from there would also be explored immediately, and so on, even though there
	// may be other, shorter paths that haven’t yet been explored.
	// Therefore, the function keeps a work list. This is an array of places that should be explored
	// next, along with the route that got us there. It starts with just the start position and an
	// empty route.
	let work = [
		{
			at: from,
			route: []
		}
	];
	// The search then operates by taking the next item in the list, and exploring that, which means
	// that all roads going from that place are looked at. If one of them is the goal, a route is
	// returned. Otherwise, if we haven’t looked at this place before, a new item is added to the list.
	// If we have looked at it before, since we are looking at short routes first, we’ve found a longer
	// route to that place or one precisely as long as the existing one. So we don’t need to explore
	// it.
	// You can visually imagine this as a web of known routes crawling out from the start location,
	// growing evenly on all sides (but never tangling back into itself). As soon as the first thread
	// reaches the goal location, that thread is traced back to the start, giving us our route.
	for (let i = 0; i < work.length; i++) {
		let { at, route } = work[i];
		for (let place of graph[at]) {
			if (place == to) return route.concat(place);
			if (!work.some(w => w.at == place)) {
				work.push({
					at: place,
					route: route.concat(place)
				});
			}
		}
		// Our code doesn’t handle the situation where there are no more work items on the work list,
		// because we know that our graph is connected, meaning that every location can be reached from
		// all other locations. We’ll always be able to find a route between two points, and the search
		// can’t fail.
	}
}

// This robot uses its memory value as a list of directions to move in, just like the route-following
// robot. Whenever that list is empty, it has to figure out what to do next. It takes the first
// undelivered parcel in the set and, if that hasn’t been picked up yet, plots a route towards it. If
// it has been picked up, it still needs to be delivered, so it creates a route towards the delivery
// address instead.
function goalOrientedRobot({ place, parcels }, route) {
	if (route.length == 0) {
		let parcel = parcels[0];
		if (parcel.place != place) {
			route = findRoute(roadGraph, place, parcel.place);
		} else {
			route = findRoute(roadGraph, place, parcel.address);
		}
	}
	return {
		direction: route[0],
		memory: route.slice(1)
	};
}

// Test, usually in ~ 16 turns, sligthly better that routeRobot but not optimal.
runRobot(VillageState.random(), goalOrientedRobot, []);

/****************************************************************************************************

	EXERCISE 1: Measuring a robot

	It’s hard to objectively compare robots by just letting them solve a few scenarios. Maybe one robot 
	just happened to get easier tasks, or the kind of tasks that it is good at, whereas the other 
	didn’t.

	Write a function compareRobots which takes two robots (and their starting memory). It should 
	generate a hundred tasks, and let each of the robots solve each of these tasks. When done, it 
	should output the average number of steps each robot took per task.

	For the sake of fairness, make sure that you give each task to both robots, rather than generating 
	different tasks per robot.

*/

// function to only get times run
function testRobot(state, robot, memory) {
	for (let turn = 0; ; turn++) {
		if (state.parcels.length == 0) {
			return turn;
			break;
		}
		let action = robot(state, memory);
		state = state.move(action.direction);
		memory = action.memory;
	}
}

function compareRobots(robot1, memory1, robot2, memory2) {
	let robot1Results = 0;
	let robot2Results = 0;
	for (let i = 0; i < 100; i++) {
		let tasks = VillageState.random();
		robot1Results += testRobot(tasks, robot1, memory1);
		robot2Results += testRobot(tasks, robot2, memory2);
	}
	console.log(
		`Robot1 took on average ${robot1Results / 100} steps (100 tries)`
	);
	console.log(
		`Robot2 took on average ${robot2Results / 100} steps (100 tries)`
	);
}

compareRobots(routeRobot, [], goalOrientedRobot, []);

/****************************************************************************************************

	EXERCISE 2: Robot efficiency

	Can you write a robot that finishes the delivery task faster than goalOrientedRobot? If you observe 
	that robot’s behavior, what obviously stupid things does it do? How could those be improved?

	If you solved the previous exercise, you might want to use your compareRobots function to verify 
	whether you improved the robot.

*/

function yourRobot({ place, parcels }, route) {
	if (route.length == 0) {
		// instead of just checking one parcel, create routes for all parcels
		// also mark pick-ups to be able to prefer these later
		let routes = parcels.map(parcel => {
			if (parcel.place != place) {
				return {
					route: findRoute(roadGraph, place, parcel.place),
					pickUp: true
				};
			} else {
				return {
					route: findRoute(roadGraph, place, parcel.address),
					pickUp: false
				};
			}
		});
		// score all routes and determine which route scores the best and return that one
		function score({ route, pickUp }) {
			// a pick-up gives a bonus of a half route segment, route length counts negatively
			return (pickUp ? 0.5 : 0) - route.length;
		}

		// Get the best route:
		route = routes.reduce((a, b) => (score(a) > score(b) ? a : b)).route;
	}

	return {
		direction: route[0],
		memory: route.slice(1)
	};
}

compareRobots(yourRobot, [], goalOrientedRobot, []);

/****************************************************************************************************

	EXERCISE 3: Persistent group

	Most data structures provided in a standard JavaScript environment aren’t very well suited for 
	persistent use. Arrays have slice and concat methods, which allow us to easily create new arrays 
	without damaging the old one. But Set, for example, has no methods for creating a new set with an 
	item added or removed.

	Write a new class PGroup, similar to the Group class from Chapter 6, which stores a set of values. 
	Like Group, it has add, delete, and has methods.

	Its add method, however, should return a new PGroup instance with the given member added, and leave 
	the old one unchanged. Similarly, delete creates a new instance without a member.

	The class should work for keys of any type, not just strings. It does not have to be efficient when 
	used with large amounts of keys.

	The constructor shouldn’t be part of the class’ interface (though you’ll definitely want to use it 
	internally). Instead, there is an empty instance, PGroup.empty, that can be used as a starting 
	value.

	Why do you only need one PGroup.empty value, rather than having a function that creates a new, 
	empty map every time?

*/

class PGroup {
	constructor(members) {
		this.members = members;
	}
	add(value) {
		if (this.has(value)) {
			return this;
		} else {
			return new PGroup(this.members.concat([value]));
		}
	}
	delete(value) {
		if (!this.has(value)) {
			return this;
		} else {
			return new PGroup(this.members.filter(m => m !== value));
		}
	}
	has(value) {
		return this.members.includes(value);
	}
}

PGroup.empty = new PGroup([]);

let a = PGroup.empty.add('a');
let ab = a.add('b');
let b = ab.delete('a');

console.log(b.has('b'));
// → true
console.log(a.has('b'));
// → false
console.log(b.has('a'));
// → false
