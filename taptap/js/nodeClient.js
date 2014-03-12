var socket = io.connect( 'http://localhost:8080' );

main.addEventListener("click", function(evt) {
	socket.emit( 'click', { message: "I just clicked!" });
});

socket.on('init', function( data ) {
	console.log( data.message );
});

socket.on('new user', function ( data ) {
	console.log("New user with id: " + data.id);
});
