var socket = io.connect( 'http://localhost:8080' );

socket.on('id', function (data) {
	id = data.id;
	createPlayer( id, "Me", main.style.background, 0 );
});

socket.on('new player', function ( data ) {
	createPlayer( data.id, data.name, data.color, 0);
	newPlayer.innerHTML = "<p>The new player " + data.name + " has joined.</p>";
	//console.log("The new player " + data.name + " has joined!");
});

socket.on('controls on', function ( data ) {
	turnOnControls();
	console.log( data.message );
});

socket.on('controls off', function() {
	turnOffControls();
});

socket.on('begin game', function() {
	bGameStarted = true;
	addPlayerList();
	removeReady();
	newPlayer.innerHTML = "";
});

socket.on('waiting for players', function() {
	console.log("not ready!");
	controls.classList.add('controls-waiting');
	controls.classList.remove('controls-ready');
	controls.innerHTML = "<h1>Waiting</h1>";
});

socket.on('players ready', function() {
	console.log("ready!");
	controls.classList.add('controls-ready');
	controls.classList.remove('controls-waiting');
	controls.innerHTML = "<h1>Start</h1>";
});

socket.on('point', function ( data ) {
	for (var i = 0; i < players.length; i++) {
		if ( players[i].id == data.id ) {
			console.log( players[i].name + " | " + i);
			players[i].score++;
			document.getElementById('player' +  i).childNodes[1].innerHTML = players[i].score;
		}
	}
});

main.addEventListener('mousedown', function(evt) {
	if ( bGameStarted ) {
		socket.emit( 'click', { message: 'I just clicked!' });
		players[0].score++;
		document.getElementById('player0').childNodes[1].innerHTML = players[0].score;


		duration = (1 - (players[0].score / maxTaps)) * 1000;
		console.log(duration);

		window.clearInterval(blink);
		blink = setInterval( function() {

			if ( switchColor ) {
				startColor = { r: 255, g: 255, b: 255 };
				endColor = { r: red, g: green, b: blue };
			}
			else {
				startColor = { r: red, g: green, b: blue };
				endColor = { r: 255, g: 255, b: 255 };
			}

			console.log("new fade!");

			fade( main, 'background', startColor, endColor, duration);
		},  duration);

		//duration = (1 - (players[0].score / maxTaps)) * 1000;


		explosion.play();
	}
});

main.addEventListener('touchstart', function(evt) {
	if ( bGameStarted ) {
		socket.emit( 'click', { message: 'I just clicked!' });
		players[0].score++;
		document.getElementById('player0').childNodes[1].innerHTML = players[0].score;

		explosion.play();
	}
});

controls.addEventListener('click', function(evt) {
	socket.emit( 'begin game' );
});

create.addEventListener('keydown', function(evt) {
	if (evt.keyCode == 13 ) {
		var input = document.querySelector("input");
		socket.emit( 'new player info', { name: input.value, color: main.style.background });

		removeCreate();
		addReady();
	}
});

submit.addEventListener('click', function(evt) {
	evt.preventDefault();
	evt.stopPropagation();

	var input = document.querySelector("input");
	socket.emit( 'new player info', { name: input.value, color: main.style.background });

	removeCreate();
	addReady();
})

ready.addEventListener('click', function(evt) {
	toggleReady();
	socket.emit('ready', { ready: bIsReady });
});