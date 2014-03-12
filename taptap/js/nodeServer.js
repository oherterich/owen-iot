var socket = require( 'socket.io' );
var express = require( 'express' );
var http = require( 'http' );

var app = express();
var server = http.createServer( app );

var io = socket.listen( server );

var players = [];
var bGameStarted = false;
var numReady = 0;

var Player = function( client, id, name, score) {
	this.client = client;
	this.id = id;
	this.name = name;
	this.score = score;
	this.ready = false;
}

io.sockets.on( 'connection', function( client ) {

	client.emit('id', { id: client.id });

	for (var i = 0; i < players.length; i++) {
		client.emit('new player', { id: players[i].id, name: players[i].name, color: players[i].color });
	}

	client.on('new player info', function (data) {
		if ( players.length < 1 ) {
			client.emit( 'controls on', { message: "You are the leader!" } );
		}

		players.push( new Player( client, client.id, data.name, 0 ) );
		client.broadcast.emit( 'new player', { id: client.id, name: data.name, color: data.color });
	});

	client.on('click', function (data) {
		if ( bGameStarted ) {

			for ( var i = 0; i < players.length; i++ ) {
				if ( players[i].id == client.id ) {
					players[i].score++;
					client.broadcast.emit( 'point', { id: players[i].id, name: players[i].name });
				}
			}
			console.log("clicked!");
		}
	});

	client.on( 'ready', function ( data ) {
		for (var i = 0; i < players.length; i++) {
			if ( players[i].id == client.id ) {
				players[i].ready = data.ready;
				if (data.ready) numReady++;
				else numReady--;
			}
		}

		if ( numReady < players.length ) {
			players[0].client.emit('waiting for players');
			console.log("not ready!");
		}
		else {
			players[0].client.emit('players ready');
			console.log("ready!");
		}
	});

	client.on( 'begin game', function() {
		if ( numReady == players.length) {
			bGameStarted = true;
			io.sockets.emit('begin game');
			client.emit('controls off');
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