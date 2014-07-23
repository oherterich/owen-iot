var fs = require('fs');
var SerialPort = require('serialport').SerialPort;
var express = require('express');
var app = express();
var server = require('http').createServer(app)
var io = require('socket.io').listen(server);

var WWW_ROOT = './public';
var SOCKET_IO_PORT = 9001;

server.listen(SOCKET_IO_PORT);
app.use(express.static(WWW_ROOT));

var socketRedis = require('socket.io-redis');

var redis = require('redis');
var sub = redis.createClient('6379', 'isharethereforeiam.com');
sub.subscribe("netasketch");

var serialPort = "/dev/cu.usbmodem1411";
var port = 9001;
var serial = null;
var value = 0x00;
var lightOn = false;


console.log("Starting...");


fs.stat( serialPort, function( err, stats ) {
	if ( err != null ) {
		console.log( "Couldn't start " + port);
		console.log(err);
		process.exit();
	}
	console.log("Started");
	serial = new SerialPort( serialPort, {
		baudrate : 9600
	});
	//return setInterval( toggle, 1000 );
});

io.sockets.on('connection', function (client) {

	client.on( 'up', function() {
		value = 0x10;
		console.log(value);
		console.log('up');
		serial.write( new Buffer([value]) );
	});

	client.on( 'down', function() {
		value = 0x11;
		console.log(value);
		console.log('down');
		serial.write( new Buffer([value]) );
	});

	client.on( 'left', function() {
		value = 0x00;
		console.log(value);
		console.log('left');
		serial.write( new Buffer([value]) );
	});

	client.on( 'right', function() {
		value = 0x01;
		console.log(value);
		console.log('right');
		serial.write( new Buffer([value]) );
	});

});

sub.on("message", function(channel, message) {
	console.log('channel: ' + channel + '  | message: ' + message );
	
	if ( channel == 'netasketch' ) {
		switch ( message ) {
			case 'up' :
				value = 0x10;
				console.log(value);
				console.log('up');
				serial.write( new Buffer([value]) );
				break;

			case 'down' :
				value = 0x11;
				console.log(value);
				console.log('down');
				serial.write( new Buffer([value]) );
				break;

			case 'left' :
				value = 0x00;
				console.log(value);
				console.log('left');
				serial.write( new Buffer([value]) );
				break;

			case 'right' :
				value = 0x01;
				console.log(value);
				console.log('right');
				serial.write( new Buffer([value]) );
				break;
		}
	}
});