var socket = require( 'socket.io' );
var express = require( 'express' );
var http = require( 'http' );

var app = express();
var server = http.createServer( app );

var io = socket.listen( server );

var players = [];

var Player = function( client, id, score ) {
	this.client = client;
	this.id = id;
	this.score = score;
}

io.sockets.on( 'connection', function( client ) {

	if ( players.length < 1 ) {
		client.emit( 'controls', { message: "You are the leader!" } );
	}

	players.push( new Player( client, client.id, 0 ) );

	client.broadcast.emit( 'new user', { id: client.id });

	client.emit('init', { message: "OMG IT WORKS!" } );

	client.on('click', function (data) {
		for ( var i = 0; i < players.length; i++ ) {
			if ( players[i].id == client.id ) {
				players[i].score++;
			}
			console.log( players[i].id + " | " + players[i].score );
		}
	});

	client.on('disconnect', function (data) {
		console.log(client.id + " has disconnected!");
		for ( var i = 0; i < players.length; i++ ) {
			if ( players[i].id == client.id ) {
				players.splice(i, 1);
				players[0].client.emit('controls', { message: "You are now the leader!" } ); 
			}
		}
	});	
});

server.listen( 8080 );