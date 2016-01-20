var controller = new Controller();

function Controller() {
	this.servers = new Array();
}

Controller.prototype.AddServer = function(name, numEntities, worldX, worldY) {
	console.log("Controller: Adding a server with info: [" + name + ", " + numEntities + ", " + worldX + ", " + worldY + "]");
	var server = new Server(numEntities, worldX, worldY);
	this.servers[name] = server;
	
	server.ShowStats();
}

Controller.prototype.RunServer = function(name, iterations) {
	var server = this.servers[name];
	server.Run(iterations);
	server.ShowStats();
}





function Server(numEntities, worldX, worldY) {
	this.numEntities = numEntities;
	this.worldX = worldX;
	this.worldY = worldY;

	this.entityList = [];
	this.pregnantList = [];
	this.CreateWorld();
	this.PopulateWorld();
}

Server.prototype.CreateWorld = function() {
	this.world = new Array(this.worldX);
	for (var i = 0; i <= this.worldX; i++) {
		this.world[i] = new Array(this.worldY);
	}

	console.log("Server: Created worth with dimensions: [" + this.worldX + ", " + this.worldY + "]");
};

Server.prototype.PopulateWorld = function() {
	for (var i = 0; i < this.numEntities; i++) {
		var strength = randomNumber(20, 1);
		var loc;

		do {
			loc = this.GetRandomLocation();
		} while (this.GetEntityByCoords(loc.x, loc.y));

		this.AddEntity(strength, loc.x, loc.y);
	}

	console.log("Server: Populated with " + this.numEntities + " entities.");
};

Server.prototype.GetEntityByCoords = function(x, y) {
	//console.log("Server: Accessing [" + x + ", " + y + "]");
	return this.world[x][y];
};

Server.prototype.GetEntityNum = function(entity) {
	for (var i = 0; i < this.entityList.length; i++) {
		var ent = this.entityList[i];
		if (entity === ent) {
			return i;
		}
	}

	return null;
};

Server.prototype.Run = function(iterations) {
	for (var i = 0; i < iterations; i++) {
		this.Update();
		var curr = i + 1;
		console.log("FINISHED UPDATE " + curr + "/" + iterations);
	}
};

Server.prototype.Update = function() {
	// Add entities from the pending list
	while (this.pregnantList.length > 0) {
		var pair = this.pregnantList.pop();
		var pregnant = pair.pregnant;
		var partner = pair.partner;

		var range = Math.abs(partner.GetStrength() - pregnant.strength) + 1;
		var start = Math.min(partner.GetStrength(), pregnant.strength);
		var strength = randomNumber(range, start, true);
		var loc, x, y;

		if (pregnant.Surrounded()) {
			x = pregnant.x;
			y = pregnant.y;
			loc = pregnant.GetRandomDirection(x, y);
			var target = this.GetEntityByCoords(x, y);

			// Makeshift attack code
			if (strength >= target.GetFitness()) {
				loc = target.GetLocation();
				strength++;

				target.Kill();
			} else {
				continue;
			}

		} else {
			do {
				x = pregnant.x;
				y = pregnant.y;
				loc = pregnant.GetRandomDirection(x, y);
			} while (this.GetEntityByCoords(loc.x, loc.y));
		}

		var entity = this.AddEntity(strength, loc.x, loc.y);
	}

	// Delete dead entities
	for (var i = this.entityList.length - 1; i >= 0; i--) {
		var entity = this.entityList[i];
		if (entity.toDie) {
			this.RemoveFromList(entity);
		}
	}

	// Update all living entities
	for (var i = 0; i < this.entityList.length; i++) {
		var curr = i + 1;
		console.log("Updating Entity " + curr + "/" + this.entityList.length);
		var entity = this.entityList[i];
		if (!entity.toDie) {
			entity.Update();
		}
	}
};

Server.prototype.GetRandomLocation = function() {
	var location = new Object();
	location.x = randomNumber(this.worldX);
	location.y = randomNumber(this.worldY);
	return location;
};

Server.prototype.MoveEntityTo = function(entity, x, y) {
	this.RemoveFromWorld(entity);
	this.world[x][y] = entity;

	var loc = entity.GetLocation();
	
	if (loc.x != x || loc.y != y) {
		console.log("ERROR: The entity has not correctly moved.");
	}
	
};

Server.prototype.RemoveFromWorld = function(entity) {
	var loc = entity.GetLocation();
	this.world[loc.x][loc.y] = null;
};

Server.prototype.RemoveFromList = function(entity) {
	var index;

	for (var i = 0; i < this.entityList.length; i++) {
		if (this.entityList[i] === entity) {
			index = i;
			break;
		}
	}

	this.entityList.splice(index, 1);
};

Server.prototype.AddEntity = function(strength, x, y) {
	var gender = randomNumber(2) ? "male" : "female";

	var entity = new Entity(this, strength, gender, x, y);
	this.entityList.push(entity);
	this.world[x][y] = entity;

	return entity;
};

Server.prototype.AddPregnant = function(pair) {
	this.pregnantList.push(pair);
};

Server.prototype.ShowStats = function() {
	var max = 0;
	var min = 100;
	var average, fitness;
	var sum = 0;
	var num = this.entityList.length;
	console.log("entityList has " + num + " entities.");

	for (var i = 0; i < num; i++) {
		fitness = this.entityList[i].GetFitness();
		//console.log("fitness of " + fitness);
		if (fitness > max) {
			max = fitness;
		}
		if (fitness < min) {
			min = fitness;
		}
		sum += fitness;
	}

	average = sum / num;
	average = average.toFixed(2);

	AddStat("num: " + num);
	AddStat("min: " + min);
	AddStat("max: " + max);
	AddStat("average: " + average);
	AddStat("\n");
};


/* loop through world array:
	for (var x = 0; x <= this.worldX; x++) {
		for (var y = 0; y <= this.worldY; y++) {

		}
	}
*/

// **************************************************************************************************


function Entity(server, strength, gender, x, y) {
	this.server = server;
	this.experience = 0;
	this.strength = strength;
	this.gender = gender;
	this.toDie = false;
	this.canMove = true;
	this.pregnant = false;

	this.x = x;
	this.y = y;
}

Entity.prototype.Attack = function(target) {
	var killedNum, targetNum;

	if (target === this) {
		console.log("An error has ocurred. An entity is targeting itself");

		return null;
	}

	if (this.GetFitness() >= target.GetFitness()) {
		var loc = target.GetLocation();

		killedNum = this.server.GetEntityNum(target);
		targetNum = this.server.GetEntityNum(this);

		target.Kill();
		this.MoveTo(loc.x, loc.y);
	} else {
		
		killedNum = this.server.GetEntityNum(this);
		targetNum = this.server.GetEntityNum(target);

		this.Kill();
	}

	console.log("Entity #" + targetNum + " has killed entity #" + killedNum);
};

Entity.prototype.Update = function() {
	if (this.canMove) {
		this.MoveRandom();
	} else {
		this.canMove = true;
	}
};

Entity.prototype.Kill = function() {
	// Set to be removed from the array, remove from the world.
	this.toDie = true;
	this.RemoveFromWorld();
};

Entity.prototype.Mate = function(entity) {
	var obj = new Object();
	obj.pregnant = this;
	obj.partner = entity;

	this.server.AddPregnant(obj);
	this.canMove = false;
	entity.canMove = false;
};

Entity.prototype.GetFitness = function() {
	return this.experience + this.strength;
};

Entity.prototype.GetStrength = function() {
	return this.strength;
};

Entity.prototype.GetGender = function () {
	return this.gender;
};

Entity.prototype.GetLocation = function() {
	var loc = new Object();
	loc.x = this.x;
	loc.y = this.y;
	return loc;
};

Entity.prototype.MoveTo = function(x, y) {
	this.x = x;
	this.y = y;
	this.server.MoveEntityTo(this, x, y);
};

Entity.prototype.MoveRandom = function() {
	// Pick a random direction and try to move there. If there is someone already there: mate or attack
	var loc = this.GetRandomDirection();
	var entity = this.server.GetEntityByCoords(loc.x, loc.y);

	if (entity === this) {
		var error = " and (" + loc.x + ", " + loc.y + ")";
		console.log("Error: Entity located at (" + this.x + ", " + this.y + ")" + error);

		return null;
	}

	if (entity) {
		if (entity.GetGender() == this.gender) {
			this.Attack(entity);
		} else {
			this.Mate(entity);
		}
	} else {
		this.MoveTo(loc.x, loc.y);
	}
};

Entity.prototype.GetRandomDirection = function(x, y) {
	var _x = (typeof x === "undefined") ? this.x : x;
	var _y = (typeof y === "undefined") ? this.y : y;
	var direction;
	var attempt = 0;
	var xMax = this.server.worldX;
	var yMax = this.server.worldY;
	
	do {
		x = _x;
		y = _y;
		attempt++;
		direction = randomNumber(4);
		

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

		//console.log("Attempt " + attempt + ", Random number: " + direction + " that gives coords: (" + x + ", " + y + ")");
	} while (x < 0 || y < 0 || x > xMax || y > yMax);

	var loc = new Object();
	loc.x = x;
	loc.y = y;

	if ((x == _x) && (y == _y)) {
		console.log("**RandomDirection returned the same direction**");
	}

	return loc;
};

Entity.prototype.RemoveFromWorld = function() {
	this.server.RemoveFromWorld(this);
};

Entity.prototype.Surrounded = function() {
	var xMax = this.server.worldX;
	var yMax = this.server.worldY;
	var x = this.x;
	var y = this.y;

	if ((x + 1) >= 0 && (x + 1) <= xMax) {
		if (!this.server.GetEntityByCoords(x + 1, y))
			return false;
	}
	if ((x - 1) >= 0 && (x - 1) <= xMax) {
		if (!this.server.GetEntityByCoords(x - 1, y))
			return false;
	}
	if ((y + 1) >= 0 && (y + 1) <= yMax) {
		if (!this.server.GetEntityByCoords(x, y + 1))
			return false;
	}
	if ((y - 1) >= 0 && (y - 1) <= yMax) {
		if (!this.server.GetEntityByCoords(x, y - 1))
			return false;
	}
	
	return true;
};




function randomNumber(range, start, weighted) {
	start = (typeof start === "undefined") ? 0 : start;
	weighted = (typeof weighted === "undefined") ? false : weighted;
	
	if (weighted) {
		range = Math.ceil(range/2);

		if (range % 2 == 0) {
			var result = Math.floor(Math.random()*range) + Math.floor(Math.random()*(range)) + start;
		} else {
			var result = Math.floor(Math.random()*range) + Math.floor(Math.random()*(range+1)) + start;
		}
	} else {
		var result = Math.floor(Math.random()*range) + start;
	}
	
	return result;
}




function ClearStats() {
	var theTextBox = document.getElementById("stats");
    theTextBox.value = '';
}

function AddStat(text) {
	var theTextBox = document.getElementById("stats");
    theTextBox.value += text + '\n';
}

function AddText(text){
    var theTextBox = document.getElementById("textbox");
    theTextBox.value += text + '\n';
}

