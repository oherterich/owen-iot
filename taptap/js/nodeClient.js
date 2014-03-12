var socket = io.connect( 'http://localhost:8080' );

socket.on('id', function (data) {
	id = data.id;
	createPlayer( id, "Me", main.style.background, 0 );
});

socket.on('new player', function ( data ) {
	createPlayer( data.id, data.name, data.color, 0);
	console.log("The new player " + data.name + " has joined!");
});

socket.on('controls', function ( data ) {
	turnOnControls();
	console.log( data.message );
});

main.addEventListener('click', function(evt) {
	socket.emit( 'click', { message: 'I just clicked!' });
});

create.addEventListener('keydown', function(evt) {
	if (evt.keyCode == 13 ) {
		var input = document.querySelector("input");
		socket.emit( 'new player info', { name: input.value, color: main.style.background });

		create.classList.add('create-hidden');
		create.classList.remove('create-visible');
	}

});