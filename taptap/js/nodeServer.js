var socket = require( 'socket.io' );
var express = require( 'express' );
var http = require( 'http' );

var app = express();
var server = http.createServer( app );

var io = socket.listen( server );

var players = [];

var Player = function( id, score ) {
	this.id = id;
	this.score = score;
}

io.sockets.on( 'connection', function( client ) {

	players.push( new Player( client.id, 0 ) );

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
});

server.listen( 8080 );