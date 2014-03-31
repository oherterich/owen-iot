var socket = io.connect( 'http://isharethereforeiam.com:8080' ); //Connect to socket.io

//We just want to know our id so that we can add ourselves to the player list.
socket.on('id', function (data) {
	id = data.id;
	addPlayer( id, "Me", main.style.background, 0 );
});

//Every time someone joins, create a new player and add it to the array.
socket.on('new player', function ( data ) {
	addPlayer( data.id, data.name, data.color, 0);
	newPlayer.innerHTML = "<p>The new player " + data.name + " has joined.</p>";
	console.log( data.id + " | " + data.name + " | " + data.color);
});

//Turns on controls, mostly for the "leader".
socket.on('controls on', function ( data ) {
	turnOnControls();
	addReady();
	console.log( data.message );
});

//Turns off controls, mostly for the "leader".
socket.on('controls off', function() {
	turnOffControls();
});

//If the game has begun, display the score and take away the buttons and things.
socket.on('begin game', function() {
	bGameStarted = true;
	addPlayerList();
	removeReady();
	newPlayer.innerHTML = "";
});

//If we are still waiting, we can't start yet.
socket.on('waiting for players', function() {
	console.log("not ready!");
	controls.classList.add('controls-waiting');
	controls.classList.remove('controls-ready');
	controls.innerHTML = "<h1>Waiting</h1>";
});

//If everyone is ready, we get the start button.
socket.on('players ready', function() {
	console.log("ready!");
	controls.classList.add('controls-ready');
	controls.classList.remove('controls-waiting');
	controls.innerHTML = "<h1>Start</h1>";
});

//We need to listen for the server to tell us the score.
socket.on('point', function ( data ) {
	for (var i = 0; i < players.length; i++) {
		if ( players[i].id == data.id ) {
			console.log( players[i].name + " | " + i);
			players[i].score++;
			document.getElementById('player' +  i).childNodes[1].innerHTML = players[i].score;
		}
	}
});

//If your phone is touched, add to the score and tell everyone else.
main.addEventListener('mousedown', function(evt) {
	if ( bGameStarted ) {
		socket.emit( 'click', { message: 'I just clicked!' });
		players[0].score++;
		document.getElementById('player0').childNodes[1].innerHTML = players[0].score;

		// This code makes our screen blink when we're hit.
		// duration = (1 - (players[0].score / maxTaps)) * 1000;
		// console.log(duration);

		// window.clearInterval(blink);
		// blink = setInterval( function() {

		// 	if ( switchColor ) {
		// 		startColor = { r: 255, g: 255, b: 255 };
		// 		endColor = { r: red, g: green, b: blue };
		// 	}
		// 	else {
		// 		startColor = { r: red, g: green, b: blue };
		// 		endColor = { r: 255, g: 255, b: 255 };
		// 	}

		// 	console.log("new fade!");

		// 	fade( main, 'background', startColor, endColor, duration);
		// },  duration);

		explosion.play();
	}
});

//If your phone is touched, add to the score and tell everyone else.
main.addEventListener('touchstart', function(evt) {
	if ( bGameStarted ) {
		socket.emit( 'click', { message: 'I just clicked!' });
		players[0].score++;
		document.getElementById('player0').childNodes[1].innerHTML = players[0].score;

		explosion.play();
	}
});

//If you're the leader, you can begin the game.
controls.addEventListener('click', function(evt) {
	socket.emit( 'begin game' );
});

//Submit your name and info to the server.
createPlayer.addEventListener('keydown', function(evt) {
	if (evt.keyCode == 13 ) {
		var input = document.querySelector("input");
		socket.emit( 'new player info', { name: input.value, color: main.style.background });

		removeCreatePlayer();
		addRoom();
	}
});

//Submit your name and info to the server.
submitName.addEventListener('click', function(evt) {
	evt.preventDefault();
	evt.stopPropagation();

	var input = document.querySelector("input");
	socket.emit( 'new player info', { name: input.value, color: main.style.background });

	removeCreatePlayer();
	addRoom();
});

//Toggles the ready button on/off
ready.addEventListener('click', function(evt) {
	toggleReady();
	socket.emit('ready', { ready: bIsReady });
});

submitRoom.addEventListener('click', function(evt) {
	evt.preventDefault();
	evt.stopPropagation();

	var name = document.getElementById("roomname");
	var password = document.getElementById("password");

	socket.emit( 'new room', { name: name.value, password: password.value });

	removeRoom();
});

socket.on( 'room-list', function( data ) {
	var room = document.createElement("p");
	room.innerHTML = data.name;
	room.classList.add('current-room');

	room.addEventListener('click', function( evt ) {
		addPassword();
		removeRoom();
		selectedRoom = room.innerHTML;
	});

	joinRoom.appendChild( room );
});

socket.on( 'remove room', function( data ) {
	var rooms = document.getElementsByClassName('current-room');
	for ( var i = 0; i < rooms.length; i++ ) {
		if ( rooms[i].innerHTML == data.name ) {
			rooms[i].parentNode.removeChild( rooms[i] );
			console.log("removed " + data.name);
		}
	}

	console.log("received the remove command");
});

submitPassword.addEventListener( 'click', function(evt) {
	var password = document.getElementById('password-input');
	socket.emit( 'join room', { roomname: selectedRoom, password: password.value  });

	removePassword();
});

socket.on( 'wrong password', function( data ) {
	var wrong = document.createElement('p');
	wrong.innerHTML = "Wrong password. Try again!";
	passwordBox.appendChild(wrong);
	addPassword();
});

socket.on( 'joined room', function( data ) {
	addReady();
});

socket.on( 'player left', function( data ) {
	var rows = document.getElementsByClassName('player-row');
	for (var i = 0; i < rows.length; i++) {
		if ( rows[i].childNodes[0].innerHTML == data.name ) {
			var thisPlayer = rows[i];
			thisPlayer.parentNode.removeChild( thisPlayer );
		}
	}
});