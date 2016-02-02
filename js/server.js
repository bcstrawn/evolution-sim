var my=null;!function(){var t={};my=t,t.Class=function(){var t,n,e=arguments.length,u=arguments[e-1],p=e>1?arguments[0]:null,c=e>2;if(u.constructor===Object?t=function(){}:(t=u.constructor,delete u.constructor),p&&(n=function(){},n.prototype=p.prototype,t.prototype=new n,t.prototype.constructor=t,t.Super=p,r(t,p,!1)),c)for(var i=1;e-1>i;i++)r(t.prototype,arguments[i].prototype,!1);return o(t,u),t};var o=t.extendClass=function(t,o,n){o.STATIC&&(r(t,o.STATIC,n),delete o.STATIC),r(t.prototype,o,n)},r=function(t,o,r){var n;if(r===!1)for(n in o)n in t||(t[n]=o[n]);else{for(n in o)t[n]=o[n];o.toString!==Object.prototype.toString&&(t.toString=o.toString)}}}();
var self = {};

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var gameloop = require('node-gameloop');
var THREE = require('three-math');

var port = process.env.PORT || 8000;

app.use(express.static(__dirname + '/public'));

var players = [];
var npcs = [];
var grid = null;
var nextId = 1;

io.on('connection', function(socket) {
	var id = nextId++;
	players.push({id: id, position: socket});

	socket.emit("message", "Welcome. Type help for a list of commands.");

	//socket.emit("npcs", getNpcs());

	console.log('a user connected');

	socket.on('command', function(command) {
		console.log("Received command: " + command);
		var stats = run(command);
		//msg.id = id;
		if (stats) {
			socket.emit('stats', stats);
		}
	});

	// socket.on("killBug", function(msg) {
	// 	removeFromList(mobs, msg.id);
	// });

	// socket.on("attack", function(tile) {
	// 	playerAttackTile(id, tile);
	// });
});

http.listen(port, function() {
	console.log('listening on *:' + port);
});

// var init = function() {
// 	grid = new GRID(4, 4);

// 	var tile = grid.getTile(3, 0);
// 	var npc = new NPC(nextId++, 3, 0, tile);

// 	grid.setNpc(npc, 3, 0);

// 	npcs.push(npc);
// };

// var getNpcs = function() {
// 	var npcsToSend = [];
// 	for (var i = npcs.length - 1; i >= 0; i--) {
// 		npcsToSend.push(npcs[i].minify());
// 	};
// 	return npcsToSend;
// };


// var getOtherPlayers = function(id) {
// 	var others = [];
// 	for (var i = players.length - 1; i >= 0; i--) {
// 		if (players[i].id != id) {
// 			others.push(players[i]);
// 		}
// 	};
// 	return others;
// };

// var removeFromList = function(list, id) {
// 	for (var i = list.length - 1; i >= 0; i--) {
// 		if (list[i].id == id) {
// 			list.splice(i, 1);
// 			return true;
// 		}
// 	};
// };

// var playerAttackTile = function(id, tile) {
// 	var tile = grid.getTile(tile.x, tile.y);
// 	var npc = tile.npc;
// 	if (npc) {
// 		console.log(id + " hit npc " + npc.id + "!");
// 		npc.health -= 2;
// 		if (npc.health <= 0) {
// 			killNpc(npc);
// 		} else {
// 			io.emit("npcs", [npc.minify()]);
// 		}
// 	} else {
// 		console.log("missed at " + tile.x + "," + tile.y + "!");
// 	}
// };

// var killNpc = function(npc) {
// 	io.emit("killNpc", {id: npc.id});
// 	grid.removeNpc(npc.position.x, npc.position.y);
// 	removeFromList(npcs, npc.id);

// 	var x = Math.floor(Math.random() * 4);
// 	var y = Math.floor(Math.random() * 4);

// 	var newNpc = new NPC(nextId++, x, y);

// 	grid.setNpc(newNpc, x, y);
// 	npcs.push(newNpc);
// 	io.emit("npcs", [newNpc.minify()]);
// 	console.log(npcs);
// };

 
// // start the loop at 30 fps (1000/30ms per frame) and grab its id 
// var frameCount = 0;
// var id = gameloop.setGameLoop(function(delta) {
// 	frameCount++;

// 	// for (var i = mobs.length - 1; i >= 0; i--) {
// 	// 	mobs[i].update(delta);
// 	// };

// }, 1000 / 30);







// var NPC = my.Class({
// 	constructor: function(id, x, y, tile) {
// 		this.id = id;
// 		this.position = {x: x, y: y};
// 		this.sprite = "da_downStand";
// 		// this.tileX = tile.gridX;
// 		// this.tileY = tile.gridY;
// 		this.health = 10;
// 	},

// 	update: function(dt) {

// 	},

// 	minify: function() {
// 		return {
// 			id: this.id, 
// 			pos: {x: this.position.x, y: this.position.y}, 
// 			sprite: this.sprite, 
// 			health: this.health
// 		};
// 	},

// });

// var GRID = my.Class({
// 	constructor: function(width, height) {
// 		this.tiles = [];

// 		for (var x = 0; x < width; x++) {
// 			var row = [];
// 			this.tiles.push(row);
// 			for (var y = 0; y < height; y++) {
// 				var tile = {x: x, y: y};
// 				this.tiles[x].push(tile);
// 			}
// 		}
// 	},

// 	setNpc: function(npc, x, y) {
// 		var tile = this.getTile(x, y);
// 		tile.npc = npc;
// 	},

// 	getTile: function(x, y) {
// 		return this.tiles[x][y];
// 	},

// 	removeNpc: function(x, y) {
// 		var tile = this.getTile(x, y);
// 		tile.npc = null;
// 	},

// });







// init();





function run(command){
	console.log("[Running Command: " + command + "]");
	var commands = command.split(' ');
	console.log(commands[0]);
	
	if (commands[0] == "help") {
		io.emit("message", "List of commands:");
		io.emit("message", "start [server name] [population] [WorldX] [WorldY] - Starts a new server");
		io.emit("message", "run [server name] [iterations] - Runs the server");
	} else if (commands[0] == "start") {
		if (commands.length < 5) {
			io.emit("message", "You must pass in 4 parameters.");
			return;
		}
		
		var name = commands[1];
		var numEntities = parseInt(commands[2]);
		var worldX = parseInt(commands[3]);
		var worldY = parseInt(commands[4]);

		io.emit("createWorld", {width: worldX, height: worldY});

		controller.addServer(name, numEntities, worldX, worldY);

		io.emit("message", "You have started a new server with the name " + name + ".");
		return controller.servers[name].getStats();
	} else if (commands[0] == "run") {

		var name = commands[1];
		var iterations = parseInt(commands[2]);
		controller.runServer(name, iterations);

		return controller.servers[name].getStats();
	}
	
	// if (player != null) {
	// 	UpdateStats(player);
	// }
}

var Controller = my.Class({

	constructor: function () {
		this.servers = new Array();
	},

	addServer: function(name, numEntities, worldX, worldY) {
		console.log("create server: ");
		console.log(name);
		console.log(numEntities);
		console.log(worldX);
		console.log(worldY);
		var server = new Server(numEntities, worldX, worldY);
		this.servers[name] = server;
	},

	runServer: function(name, iterations) {
		var server = this.servers[name];
		server.run(iterations);

		io.emit("repopulate", server.packEntityList());
	},
});



var Server = my.Class({
	constructor: function(numEntities, worldX, worldY) {

		this.numEntities = numEntities;
		this.worldX = worldX;
		this.worldY = worldY;

		this.entityList = [];
		this.createWorld();
		this.populateWorld();

		this.totalAgeAtDeath = 0;
		this.totalDeaths = 0;
	},

	createWorld: function() {
		console.log(this.worldX + 1);
		this.world = new Array(this.worldX + 1);
		for (var i = 0; i <= this.worldX; i++) {
			this.world[i] = new Array(this.worldY + 1);
		}
	},

	populateWorld: function() {
		for (var i = 0; i <= this.numEntities; i++) {
			var strength = randomNumber(20);
			var loc;

			do {
				loc = this.getRandomLocation();
			} while (this.getEntityByCoords(loc.x, loc.y));

			this.addEntity(strength, 20, loc.x, loc.y);
		}

		io.emit("populate", this.packEntityList());
	},

	getEntityByCoords: function(x, y) {
		if (!this.world[x]) {
			console.log("Passed in impossible coordinate: ", x, "as x");
		}

		return this.world[x][y];
	},

	run: function(iterations) {
		for (var i = 0; i < iterations; i++) {
			this.update();
		}
	},

	update: function() {
		for (var i = 0; i < this.entityList.length; i++) {
			var entity = this.entityList[i];
			if (entity.toDie) {
				this.removeFromList(entity);
			} else {
				entity.update();
			}
		}
	},

	getRandomLocation: function() {
		return {x: randomNumber(this.worldX), y: randomNumber(this.worldY)};
	},

	moveEntityTo: function(entity, x, y) {
		this.removeFromWorld(entity);
		this.world[x][y] = entity;
	},

	removeFromWorld: function(entity) {
		var loc = entity.getLocation();
		this.world[loc.x][loc.y] = null;
	},

	removeFromList: function(entity) {
		this.totalDeaths++;
		this.totalAgeAtDeath += entity.age;

		var index;

		for (var i = 0; i < this.entityList.length; i++) {
			if (this.entityList[i] === entity) {
				index = i;
			}
		}

		this.entityList.splice(index, 1);
	},

	addEntity: function(strength, age, x, y) {
		var gender = randomNumber(1) ? "male" : "female";
		var id = this.entityList.length + 1;

		var entity = new Entity(id, this, strength, gender, age, x, y);
		this.entityList.push(entity);
		this.world[x][y] = entity;
	},

	packEntityList: function() {

		var toSend = [];

		for (var i = 0; i < this.entityList.length; i++) {
			var entity = this.entityList[i];
			toSend.push({x: entity.x, y: entity.y, gender: entity.gender})
		}

		return toSend;
	},

	getFirstOpenSpot: function(x, y) {
		if (x > 0 && !this.getEntityByCoords(x - 1, y)) {
			return {x: x - 1, y: y};
		}
		if (x < this.worldX && !this.getEntityByCoords(x + 1, y)) {
			return {x: x + 1, y: y};
		}
		if (y > 0 && !this.getEntityByCoords(x, y - 1)) {
			return {x: x, y: y - 1};
		}
		if (y < this.worldY && !this.getEntityByCoords(x, y + 1)) {
			return {x: x, y: y + 1};
		}

		return null;
	},

	getStats: function(serverName) {
		var numMales = 0;
		var numFemales = 0;
		var totalAge = 0;
		var lifeSpan = 0;

		for (var i = this.entityList.length - 1; i >= 0; i--) {
			if (this.entityList[i].gender == "male") {
				numMales++;
			} else {
				numFemales++;
			}

			totalAge += this.entityList[i].age;
		};

		if (this.totalDeaths) {
			lifeSpan = this.totalAgeAtDeath / this.totalDeaths;
			this.totalAgeAtDeath = this.totalDeaths = 0;
		}
		var averageAge = totalAge / this.entityList.length;

		return {
			population: this.entityList.length,
			males: numMales,
			females: numFemales,
			age: averageAge,
			lifespan: lifeSpan,
		};
	},

});


// **************************************************************************************************


var Entity = my.Class({

	constructor: function (id, server, strength, gender, age, x, y) {
		this.id = id;
		this.server = server;
		this.experience = 0;
		this.strength = strength;
		this.gender = gender;
		this.toDie = false;
		this.procreateTimer = 99;
		this.vision = 3;
		this.age = age;

		this.x = x;
		this.y = y;
	},

	update: function() {
		this.age += 1/12;

		if (this.age > 100) {
			this.kill();
			return;
		}

		this.move();
		this.procreateTimer += 1/12;
	},

	move: function() {
		// no mates found- pick a random direction and try to move there
		this.moveToRandomLocation();
	},

	moveTowardsEntity: function(entity) {
		if (entity.x > this.x) {
			return this.moveToLocation({x: this.x + 1, y: this.y});
		}
		if (entity.x < this.x) {
			return this.moveToLocation({x: this.x - 1, y: this.y});
		}
		if (entity.y > this.y) {
			return this.moveToLocation({x: this.x, y: this.y + 1});
		}
		if (entity.y < this.y) {
			return this.moveToLocation({x: this.x, y: this.y - 1});
		}
	},

	moveToRandomLocation: function() {

		var loc = this.getRandomDirection();
		while (loc.x == this.x && loc.y == this.y) {
			loc = this.getRandomDirection();
		}

		this.moveToLocation(loc);
	},

	moveToLocation: function(loc) {

		var entity = this.server.getEntityByCoords(loc.x, loc.y);

		if (entity) {
			if (this.age > 15 && entity.age > 15) {
				if (entity.getGender() == this.gender) {
					this.attack(entity);
				} else {
					if (this.gender == "female") {
						this.procreate(entity);
					} else {
						entity.procreate(this);
					}
				}	
			}
		} else {
			this.moveTo(loc.x, loc.y);
		}
	},

	attack: function(target) {
		if (target == this) {
			console.log("entity " + this.id + " tried to attack himself");
			return;
		}

		if (this.getFitness() >= target.getFitness()) {
			var loc = target.getLocation();

			target.kill(this);
			this.moveTo(loc.x, loc.y);
		} else {
			this.kill(target);

		}
	},

	kill: function(other) {
		// Set to be removed from the array, remove from the world.
		this.toDie = true;
		this.removeFromWorld();
	},

	procreate: function(entity) {
		if (this.procreateTimer < 1) return;

		this.procreateTimer = 0;

		var loc = this.server.getFirstOpenSpot(this.x, this.y);
		if (!loc) {
			return;
		}

		var strength = randomNumber(20);

		this.server.addEntity(strength, 0, loc.x, loc.y);
	},

	getFitness: function() {
		return this.experience + this.strength;
	},

	getGender: function () {
		return this.gender;
	},

	getLocation: function() {
		return {x: this.x, y: this.y};
	},

	moveTo: function(x, y) {
		this.server.moveEntityTo(this, x, y);
		this.x = x;
		this.y = y;
	},

	getRandomDirection: function() {
		var x = this.x;
		var y = this.y;
		var direction = randomNumber(3);

		switch(direction) {
			case 0:
				y++;
				break;
			case 1:
				x++
				break;
			case 2:
				y--;
				break;
			case 3:
				x--;
				break;
			default:
				console.log("There was an error: direction was out of bounds.")
		}

		return {
			x: Math.min(Math.max(x, 0), this.server.worldX - 1),
			y: Math.min(Math.max(y, 0), this.server.worldY - 1)
		};
	},

	removeFromWorld: function() {
		this.server.removeFromWorld(this);
	},


});




function randomNumber(num) {
	var result = Math.floor(Math.random()*(num+1))
	return result;
}





var controller = new Controller();



