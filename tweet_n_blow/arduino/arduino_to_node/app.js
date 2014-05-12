// ARDUINO -> NODE.JS

var net = require('net');
var port = 8000;
var	server = net.createServer(function(socket) {
	console.log('server connected');
	socket.setEncoding('ascii');
	socket.on('end', function() {
		console.log('server disconnected');
	});
	socket.on('data', function(data){
		console.log('data: ' + data);
	});
});
	

server.listen(port, function() {
	console.log('server running on: ' + port);
});