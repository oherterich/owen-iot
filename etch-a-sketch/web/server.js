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
var pub = redis.createClient();
pub.publish("banana", "hello world!");

io.adapter( socketRedis({ host: '127.0.0.1', port : 6379, pubClient : "banana" }) );


var serialPort = "/dev/cu.usbmodem1431";
var serial = null;
var value = 0x00;
var lightOn = false;

console.log("Starting...");

io.sockets.on('connection', function (client) {

	client.on( 'up', function() {
		console.log('up');
		pub.publish("netasketch", "up");
	});

	client.on( 'down', function() {
		console.log('down');
		pub.publish("netasketch", "down");
	});

	client.on( 'left', function() {
		console.log('left');
		pub.publish("netasketch", "left");
	});

	client.on( 'right', function() {
		console.log('right');
		pub.publish("netasketch", "right");
	});

});