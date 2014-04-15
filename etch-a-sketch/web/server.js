var fs = require('fs');
var express = require('express');
var SerialPort = require('serialport').SerialPort;
var io = require('socket.io').listen(9000);
var connect = require('connect');

var app = express();


var serialPort = "/dev/cu.usbmodem1411";
var port = 9001;
var serial = null;
var value = 0x00;
var lightOn = false;

toggle = function() {
	if ( lightOn ) {
		value = 0x01;
	}
	else {
		value = 0x00;
	}
	lightOn = !lightOn;

	return serial.write( new Buffer([value]) );
}

console.log("Starting...");


fs.stat( serialPort, function( err, stats ) {
	if ( err != null ) {
		console.log( "Couldn't stat " + port);
		process.exit();
	}
	console.log("Started");
	serial = new SerialPort( serialPort, {
		baudrate : 9600
	});
	//return setInterval( toggle, 1000 );
});

connect.createServer( connect.static(__dirname + '/public')).listen(port);

io.sockets.on('connection', function (client) {

	client.on( 'up', function() {
		value = 0x01;
		serial.write( new Buffer([value]) );
	});

	client.on( 'down', function() {
		value = 0x00;
		serial.write( new Buffer([value]) );
	});

});