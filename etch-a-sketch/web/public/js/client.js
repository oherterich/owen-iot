//var socket = io.connect('http://isharethereforeiam.com:9000');
//var socket = io.connect('http://localhost:9000');
var socket = io.connect('http://' + window.location.hostname + ':9001');

var up, down, left, right;
up = document.getElementById('up');
down = document.getElementById('down');
left = document.getElementById('left');
right = document.getElementById('right');

up.addEventListener('click', function(evt) {
	evt.preventDefault();
	socket.emit( 'up' );
});

down.addEventListener('click', function(evt) {
	evt.preventDefault();
	socket.emit( 'down' );
});

left.addEventListener('click', function(evt) {
	evt.preventDefault();
	socket.emit( 'left' );
	console.log('left');
});

right.addEventListener('click', function(evt) {
	evt.preventDefault();
	socket.emit( 'right' );
	console.log('right');
});
