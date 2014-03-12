var socket = io.connect( 'http://localhost:8080' );

socket.on('id', function (data) {
	id = data.id;
	createPlayer( id, "Me", main.style.background, 0 );
});

socket.on('new player', function ( data ) {
	createPlayer( data.id, data.name, data.color, 0);
	console.log("The new player " + data.name + " has joined!");
});

socket.on('controls on', function ( data ) {
	turnOnControls();
	console.log( data.message );
});

socket.on('controls off', function() {
	turnOffControls();
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

main.addEventListener('click', function(evt) {
	socket.emit( 'click', { message: 'I just clicked!' });
	players[0].score++;
	document.getElementById('player0').childNodes[1].innerHTML = players[0].score;
});

controls.addEventListener('click', function(evt) {
	socket.emit( 'begin game' );
});

create.addEventListener('keydown', function(evt) {
	if (evt.keyCode == 13 ) {
		var input = document.querySelector("input");
		socket.emit( 'new player info', { name: input.value, color: main.style.background });

		create.classList.add('create-hidden');
		create.classList.remove('create-visible');
	}
});