var controller = new Controller();

function Controller() {
	this.servers = new Array();
}

Controller.prototype.AddServer = function(name, numEntities, worldX, worldY) {
	var server = new Server(numEntities, worldX, worldY);
	this.servers[name] = server;
}

Controller.prototype.RunServer = function(name, iterations) {
	var server = this.servers[name];
	server.Run(iterations);
}


function Server(numEntities, worldX, worldY) {
	this.entityList = [];
	this.PopulateWorld();
	this.CreateWorld();

	this.numEntities = numEntities;
	this.worldX = worldX;
	this.worldY = worldY;
}

Server.prototype.CreateWorld = function() {
	this.world = new Array(this.worldX + 1);
	for (var i = 0; i <= this.worldX; i++) {
		this.world[i] = new Array(this.worldY + 1);
	}
}

Server.prototype.PopulateWorld = function() {
	for (var i = 0; i <= this.numEntities; i++) {
		var strength = randomNumber(20);
		var loc;

		do {
			loc = this.GetRandomLocation();
		} while (this.GetEntityByCoords(loc.x, loc.y));

		this.AddEntity(strength, loc.x, loc.y);
	}
}

Server.prototype.GetEntityByCoords = function(x, y) {
	return this.world[x][y];
}

Server.prototype.Run = function(iterations) {
	for (var i = 0; i < iterations; i++) {
		this.Update();
	}
}

Server.prototype.Update = function() {
	for (var i = 0; i < this.entityList.length; i++) {
		var entity = this.entityList[i];
		if (entity.toDie) {
			this.RemoveFromList(entity);
		} else {
			entity.Update();
		}
	}
}

Server.prototype.GetRandomLocation = function() {
	var location = new Object();
	location.x = randomNumber(this.worldX);
	location.y = randomNumber(this.worldY);
	return location;
}

Server.prototype.MoveEntityTo = function(entity, x, y) {
	this.RemoveFromWorld(entity);
	this.world[x][y] = entity;
}

Server.prototype.RemoveFromWorld = function(entity) {
	var loc = entity.GetLocation();
	this.world[loc.x][loc.y] = null;
}

Server.prototype.RemoveFromList = function(entity) {
	var index;

	for (var i = 0; i < this.entityList.length; i++) {
		if (this.entityList[i] === entity) {
			index = i;
		}
	}

	this.entityList.splice(index, 1);
}

Server.prototype.AddEntity = function(strength, x, y) {
	var gender = randomNumber(1) ? "male" : "female";

	var entity = new Entity(this, strength, gender, x, y);
	this.entityList.push(entity);
	this.world[x][y] = entity;
}


//loop through world array:
	for (var x = 0; x <= this.worldX; x++) {
		for (var y = 0; y <= this.worldY; y++) {

		}
	}


// **************************************************************************************************


function Entity(server, strength, gender, x, y) {
	this.server = server;
	this.experience = 0;
	this.strength = strength;
	this.gender = gender;
	this.toDie = false;

	this.x = x;
	this.y = y;
}

Entity.prototype.Attack = function(target) {
	if (this.GetFitness() >= target.GetFitness()) {
		var loc = target.GetLocation();

		target.Kill();
		this.MoveTo(loc.x, loc.y);
	} else {
		this.Kill();
	}
}

Entity.prototype.Update = function() {
	this.MoveRandom();
}

Entity.prototype.Kill = function() {
	// Set to be removed from the array, remove from the world.
	this.toDie = true;
	this.RemoveFromWorld();
}

Entity.prototype.Mate = function(entity) {

}

Entity.prototype.GetFitness = function() {
	return this.experience + this.strength;
}

Entity.prototype.GetGender = function () {
	return this.gender;
}

Entity.prototype.GetLocation = function() {
	var loc = new Object();
	loc.x = this.x;
	loc.y = this.y;
	return loc;
}

Entity.prototype.MoveTo = function(x, y) {
	this.x = x;
	this.y = y;
	this.server.MoveEntityTo(this, x, y);
}

Entity.prototype.MoveRandom = function() {
	// Pick a random direction and try to move there. If there is someone already there: mate or attack
	var loc = this.GetRandomDirection();
	var entity = this.GetEntityByCoords(loc.x, loc.y);
	if (entity) {
		if (entity.GetGender() == this.gender) {
			this.Attack(entity);
		} else {
			this.Mate(entity);
		}
	} else {
		this.MoveTo(loc.x, loc.y);
	}
}

Entity.prototype.GetRandomDirection = function() {
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

	var loc = new Object();
	loc.x = x;
	loc.y = y;
	return loc;
}

Entity.prototype.RemoveFromWorld = function() {
	this.server.RemoveFromWorld(this);
}




function randomNumber(num) {
	var result = Math.floor(Math.random()*(num+1))
	return result;
}









//**************************************************************************************************

var game = new Game();

function Game() {
	this.player = null;
}

Game.prototype.CreatePlayer = function() {
	this.player = new Player();
	return this.player;
}

Game.prototype.GetPlayer = function() {
	return this.player;
}

//********************************************************************
//	Entity
//********************************************************************

function Entity(level, hp, attack, defense, initiative) {
	this.level = level;
	this.hp = hp;
	this.attack = attack;
	this.defense = defense;
	this.initiative = initiative;
}

Entity.prototype.Attack = function(target) {
	
}

Entity.prototype.TakeDamage = function(damage) {
	this.hp -= damage;
	if(this instanceof Player) {
		var target = 'Player';
	} else {
		var target = 'Monster';	
	}
	AddText(target + 'takes' + damage + 'damage');
}

//********************************************************************
//	Player
//********************************************************************

function Player() {
    Entity.call(this, 1, 10, 5, 5, 5);
	this.exp = 0;
	this.potions = 5;
	this.weapon = new Dagger();
	this.armor = new Tunic();
	this.gold = 25;
	this.maxhp = 10;
}
Player.prototype = new Entity();
Player.prototype.constructor = Player;

Entity.prototype.GetStats = function() {
	var stats = {
	'Level: \t \t': this.level, 'Current HP: \t': this.hp, 'Max HP: \t': this.maxhp, 
	'Attack: \t' : this.attack, 'Defense: \t' : this.defense, 'Initiative: \t' : this.initiative,
	'Experience: \t' : this.exp, 'Potions: \t' : this.potions, 'Gold: \t \t' : this.gold,
	'Weapon: \t' : this.weapon.GetName(), 'Armor: \t \t' : this.armor.GetName()};
	return stats;
}

//********************************************************************
//	Monster
//********************************************************************

function Monster(level, hp, attack, defense, initiative) {
    Entity.call(this, level, hp, attack, defense, initiative);
	this.EXPreward = hp * 1.5;
	this.Goldreward = hp * 2;
}
Monster.prototype = new Entity();
Monster.prototype.constructor = Monster;

//********************************************************************
//	Weapon
//********************************************************************

function Weapon(WPrice, WDamage, WName) {
	this.WPrice = WPrice;
	this.WDamage = WDamage;
	this.WName = WName;
}

Weapon.prototype.GetName = function() {
	return this.WName;
}


function Dagger() {
    Weapon.call(this, 25, 5, "Dagger");
}
Dagger.prototype = new Weapon();
Dagger.prototype.constructor = Dagger;

// *Future location of more Weapons*

//********************************************************************
//	Armor
//********************************************************************

function Armor(APrice, AValue, AName) {
	this.APrice = APrice;
	this.AValue = AValue;
	this.AName = AName;
}

Armor.prototype.GetName = function() {
	return this.AName;
}


function Tunic() {
    Armor.call(this, 25, 5, "Tunic");
}
Tunic.prototype = new Armor();
Tunic.prototype.constructor = Tunic;

// *Future location of more Armors*

//********************************************************************
//	Stats
//********************************************************************

function UpdateStats(player){
	var stats = player.GetStats();
	var theTextBox = document.getElementById("stats");
    theTextBox.value = '';
	for (var key in stats) {
		var obj = stats[key];
		AddStat(key + obj);
	}
}

function AddStat(text) {
	var theTextBox = document.getElementById("stats");
    theTextBox.value += text + '\n';
}

function AddText(text){
    var theTextBox = document.getElementById("textbox");
    theTextBox.value += text + '\n';
}

