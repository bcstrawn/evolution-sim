(function() {

	var TypingEngine = my.Class({

		that: this,

		constructor: function() {

			this.otherPlayers = [];
			this.shapes = [];
			this.stats = null;
			this.grid = null;

			this.oldTime = 0;
			//this.graphics = new TYPE.GraphicsEngine();
			//this.player = new TYPE.Player();
			this.network = new TYPE.Network();
			this.grid = new TYPE.Grid();
		},

		init: function() {

			this.network.init();
			//this.grid.init(100, 5, 4, 4, 128);
			//this.graphics.init(this.modelUrls, $.proxy( this.loadedModels, this ), this.grid);
		},

		loadedModels: function() {

			this.player.init(this.grid.getTile(0, 0));
			this.network.init();
			animate();
		},

		// EVENTS

		run: function(command) {
			this.network.sendCommand(command);
		},

		killAll: function() {
			$(".grid-square").removeClass("male").removeClass("female");
		},

		populate: function(entities) {
			console.log("add the entities to map");
			console.log(entities);
			for (var i = entities.length - 1; i >= 0; i--) {
				var e = entities[i];
				var grid = $("#grid_" + e.x + "_" + e.y);
				grid.addClass(e.gender);
			};
		},

		showStats: function(stats) {
			$("#population").html(stats.population);
			$("#num-males").html(stats.males);
			$("#num-females").html(stats.females);
			$("#age").html(stats.age);
			$("#lifespan").html(stats.lifespan);
		},

		createWorld: function(width, height) {
			console.log("create the world, yo. ", width, height);
			var size = 400 / Math.max(width, height);
			for (var x = 0; x < width; x++) {
				for (var y = 0; y < height; y++) {
					var grid = $("#world");
          			grid.append(
          				"<div class='grid-square' id='grid_" + x + "_" + y + "' style='" + 
          				"top:" + y*size + "px;" +
          				"left:" + x*size + "px;" +
          				"width:" + size + "px;" +
          				"height:" + size + "px;'" + 
          				"></div>"
          			);
				}
			}
			//this.grid.init(width, height, size);
		},

		updateNpc: function(dataModel) {
			if (dataModel.id == this.player.id) return;

			var player = null;
			for (var i = this.shapes.length - 1; i >= 0; i--) {
				if (this.shapes[i].id == dataModel.id) {
					player = this.shapes[i];
				}
			};

			if (player == null) {
				console.log("add new npc with id " + dataModel.id);
				var gridTile = this.grid.getTile(dataModel.pos.x, dataModel.pos.y);

				npc = new TYPE.Npc(dataModel.id, gridTile, dataModel.sprite, dataModel.health);
				this.player.targetNpc = npc;

				this.shapes.push(npc);
			} else {
				console.log("update npc " + dataModel.id);
				player.updateInfo(dataModel);
			}

			//console.log(player);
		},

		killNpc: function(npc) {
			for (var i = this.shapes.length - 1; i >= 0; i--) {
				if (this.shapes[i].id == npc.id) {
					player = this.shapes[i];
					player.die();
					this.removeShape(player);
				}
			};
		},

		// PROCESS EVENTS

		doCommand: function(name) {

			switch (name) {

				case "forwardColumn":
					this.player.moveForward();
					break;
				case "leftColumn":
					this.player.turnLeft();
					break;
				case "rightColumn":
					this.player.turnRight();
					break;
				case "fireColumn":
					this.player.shootTongue();
			}
		},

		addShape: function(shape) {

			this.graphics.addModel(shape.model);
			this.shapes.push(shape);
		},

		getShapesOfType: function(type) {

			var shapesOfType = [];

			for (var i = this.shapes.length - 1; i >= 0; i--) {
				if (this.shapes[i] instanceof type) {
					shapesOfType.push(this.shapes[i]);
				}
			};

			return shapesOfType;
		},

		removeShape: function(shape) {

			for (var i = this.shapes.length - 1; i >= 0; i--) {
				if (this.shapes[i] == shape) {
					this.shapes.splice(i, 1);
					this.graphics.removeSprite(shape.sprite);
					return;
				}
			};

			console.log("ERROR: tried to delete non-existant shape", shape);
		},

		getShapeWithId: function(id) {
			for (var i = this.shapes.length - 1; i >= 0; i--) {
				if (this.shapes[i].id == id) {
					return this.shapes[i];
				}
			};
			return false;
		},

		// OTHER


		getShapes: function() {

			var shapes = [];

			for (var i = this.shapes.length - 1; i >= 0; i--) {
				shapes.push(this.shapes[i].model);
			};

			return shapes;
		},

		updateShapeHoverStates: function() {

			var hoveredShape = this.graphics.getHoveredShape(this.getShapes());
			this.hoveredShape = null;

			for (var i = this.shapes.length - 1; i >= 0; i--) {
				var shape = this.shapes[i];

				if (shape.model == hoveredShape) {
					this.hoveredShape = shape;
					shape.setHover(true);
				}
				else {
					shape.setHover(false);
				}
			};
		},

		// USER INPUT

		mouseMove: function(event) {
		},

		mouseDown: function(event) {
		},

		click: function( event ) {
		},

		keypress: function (event) {
			var character = String.fromCharCode(event.keyCode)
		},

		keydown: function (event) {
			var character = String.fromCharCode(event.keyCode)
			var contains = false;
			for (var i = this.keys.length - 1; i >= 0; i--) {
				if (this.keys[i] == event.keyCode)
					contains = true;
			};
			if (!contains) {
				this.keys.push(event.keyCode);
			}
		},

		keyup: function (event) {
			var character = String.fromCharCode(event.keyCode)
			for (var i = this.keys.length - 1; i >= 0; i--) {
				if (this.keys[i] == event.keyCode)
					this.keys.splice(i, 1);
			};

			this.player.keyActive(event.keyCode);
		},

		zoom: function(dt) {
			this.graphics.zoom(dt);
		},

		// UPDATING

		render: function() {

			var delta = 40;

			this.graphics.render();
		},

		update: function(dt, time) {


			for (var i = this.shapes.length - 1; i >= 0; i--) {
				this.shapes[i].update(dt);
			};

			// for (var i = 0; i < this.keys.length; i++) {
			// 	// this.player.keyActive(this.keys[i]);
			// }

			// this.resources.update(dt);

			// this.updateLoadingBar(dt);

			this.graphics.update(dt);

			// this.player.sendKeys(this.keys);
			this.player.update(dt);
			//this.controls.update();

			// this.audio.update(dt, this.graphics.camera);

			// this.events.update(dt);

			// this.checkCollisions();
			TWEEN.update(time);
		},

		onWindowResize: function() {

			this.graphics.resize();
		},

	});

	TYPE.TypingEngine = TypingEngine;

})()
