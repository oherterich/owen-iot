var socket = io.connect( 'http://localhost:8080' );

var main = document.getElementById("main");
var controls = document.getElementById("controls");

var color = '#'+Math.floor(Math.random()*16777215).toString(16);
main.style.background = color;

var turnOnControls = function() {
	controls.classList.remove('controls-hidden');
	controls.classList.add('controls-visible');
}

main.addEventListener("click", function(evt) {
	socket.emit( 'click', { message: "I just clicked!" });
});

socket.on('init', function ( data ) {
	console.log( data.message );
});

socket.on('new user', function ( data ) {
	console.log("New user with id: " + data.id);
});

socket.on('controls', function ( data ) {
	turnOnControls();
	console.log( data.message );
});
