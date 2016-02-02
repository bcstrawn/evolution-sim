window.onload = function () {
	$('#command').focus();
}

$(function() {
	$('#datasend').click( function() {
		var inputBox = document.getElementById('command');
		var message = inputBox.value;
		inputBox.value = '';
		run(message);
	});

	// when the client hits ENTER on their keyboard
	$('#command').keypress(function(e) {
		if(e.which == 13) {
			$('#datasend').focus().click();
			this.focus();
		}
	});
});

function run(command){
	console.log("[Running Command: " + command + "]");
	var commands = command.split(' ');
	console.log(commands[0]);
	
	if (commands[0] == "help") {
		AddText(
			"List of commands: \n \n start server [name] [population] [WorldX] [WorldY]- Starts a new server"
		
		);
	} else if (commands[0] == "start") {
		if (commands.length < 5) {
			AddText("You must pass in 4 parameters.");
			return;
		}
		
		var name = commands[1];
		var numEntities = parseInt(commands[2]);
		var worldX = parseInt(commands[3]);
		var worldY = parseInt(commands[4]);
		controller.AddServer(name, numEntities, worldX, worldY);
		AddText("You have started a new server with the name " + name + ".");
	} else if (commands[0] == "run") {

	}
	
	if (player != null) {
		UpdateStats(player);
	}
}