(function() {

	var Network = my.Class({

		constructor: function() {
			this.socket = null;
		},

		init: function() {
			this.socket = io();
			this.socket.on('moved', function(msg) {
				type.updatePlayer(msg);
			});

			this.socket.on('connected', function(msg) {
				type.player.setId(msg);
				console.log("should have refreshed");
				console.log("ID: " + msg);
			});

			this.socket.on('message', function(message) {
				console.log("Received a message: " + message);
				var textbox = $("#textbox");
				textbox.append('<div class="message">' + "Server" + ' : ' + message + '</div>');
			    textbox.scrollTop(99999);
			});

			this.socket.on('populate', function(entities) {
				type.populate(entities);
			});

			this.socket.on('repopulate', function(entities) {
				type.killAll();
				type.populate(entities);
			});

			this.socket.on('killNpc', function(npc) {
				type.killNpc(npc);
			});

			this.socket.on("createWorld", function(dimensions) {
				type.createWorld(dimensions.width, dimensions.height);
			});

			this.socket.on("stats", function(stats) {
				type.showStats(stats);
			});
		},

		sendPlayerLocation: function(position) {
			console.log(this.socket);
			this.socket.emit('move', { position: position });
		},

		sendAttack: function(tile) {
			this.socket.emit('attack', tile);
		},

		killBug: function(id) {
			this.socket.emit('killBug', {id: id});
		},

		sendCommand: function(command) {
			this.socket.emit('command', command);
		},

	});

	TYPE.Network = Network;
})()