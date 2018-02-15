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

// Minimaly defined vilage state. Changes result in a new state instead of changing the state
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
			// parcels. The call to map takes care of the moving, and the call to filter does the delivering.
			let parcels = this.parcels
				.map(p => {
					if (p.place != this.place) return p;
					return { place: destination, address: p.address };
				})
				.filter(p => p.place != p.address);
			return new VillageState(destination, parcels);
		}
	}
}
