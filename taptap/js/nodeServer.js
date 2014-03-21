var socket = require( 'socket.io' );
var express = require( 'express' );
var http = require( 'http' );

var app = express();
var server = http.createServer( app );

var io = socket.listen( server );

var players = [];
var rooms = [];
var bGameStarted = false;
var numReady = 0;

var Player = function( client, id, name, score) {
	this.client = client;
	this.id = id;
	this.name = name;
	this.score = score;
	this.ready = false;
}

var Room = function( name, password ) {
	this.name = name;
	this.password = password;
	this.bGameStarted = false;
	this.players = [];
	this.numReady = 0;
}

io.sockets.on( 'connection', function( client ) {

	//First, we're sending the unique socket id back to the client.
	client.emit('id', { id: client.id });

	client.on( 'new room', function( data ) {
		client.join( data.name );
		client.room = data.name;

		var r = new Room( data.name, data.password );
		r.players.push( client );
		rooms.push( r );

		client.emit( 'controls on' );
		client.broadcast.emit( 'room-list', { name: data.name } );
	});

	client.on( 'join room', function( data ) {
		for (var i = 0; i < rooms.length; i++) {
			if ( rooms[i].name == data.roomname ) {
				if ( rooms[i].password == data.password ) {
					client.join( data.roomname );
					client.room = data.roomname;

					for (var j = 0; j < rooms[i].players.length; j++) {
						client.emit('new player', { id: rooms[i].players[j].id, name: rooms[i].players[j].name, color: rooms[i].players[j].color });
					}

					rooms[i].players.push( client );

					client.emit( 'joined room' );
					client.broadcast.to(rooms[i].name).emit( 'new player', { id: client.id, name: client.name, color: client.color });
				}
				else {
					client.emit('wrong password');
				}
			}
		}
	});

	client.on('new player info', function (data) {
		players.push( new Player( client, client.id, data.name, 0 ) );

		client.name = data.name;
		client.score = 0;
		client.ready = false;
		client.color = data.color;

		for (var i = 0; i < rooms.length; i++) {
			if ( rooms[i].bGameStarted == false ) {
				client.emit( 'room-list', { name: rooms[i].name } );
			}
		}
	});

	client.on('click', function (data) {
		for (var i = 0; i < rooms.length; i++) {
			if ( client.room == rooms[i].name ) {
				if ( rooms[i].bGameStarted ) {
					for ( var j = 0; j < rooms[i].players.length; j++ ) {
						if ( rooms[i].players[j].id == client.id ) {
							rooms[i].players[j].score++;
							client.broadcast.to(rooms[i].name).emit( 'point', { id: rooms[i].players[j].id, name: rooms[i].players[j].name });
						}
					}
				}
			}
		}
	});

	client.on( 'ready', function ( data ) {
		client.ready = data.ready;

		for (var i = 0; i < rooms.length; i++) {
			if ( client.room == rooms[i].name ) {
				if (data.ready) rooms[i].numReady++;
					else rooms[i].numReady--;

				if (rooms[i].numReady < rooms[i].players.length ) {
					rooms[i].players[0].emit('waiting for players');
				}
				else {
					rooms[i].players[0].emit('players ready');	
				}
			}
		}
	});

	client.on( 'begin game', function() {
		for (var i = 0; i < rooms.length; i++) {
			if ( client.room == rooms[i].name ) {
				if ( rooms[i].numReady == rooms[i].players.length) {
					rooms[i].bGameStarted = true;
					io.sockets.in(rooms[i].name).emit('begin game');
					client.emit('controls off');
					client.broadcast.emit('remove room', { name: client.room });
				}
			}
		}
	});

	client.on('disconnect', function (data) {
		console.log(client.id + " has disconnected!");
		for (var i = 0; i < rooms.length; i++) {
			if ( client.room == rooms[i].name ) {
				for ( var j = 0; j < rooms[i].players.length; j++ ) {
					if ( client.id == rooms[i].players[j].id ) {
						client.broadcast.to(rooms[i].name).emit( 'player left', { id: client.id, name: client.name });
						rooms[i].players.splice( j, 1 );
						if (rooms[i].players.length > 0 && rooms[i].bGameStarted == false) {
							rooms[i].players[0].emit('controls on', { message: "You are now the leader!" } );
						}
					}
				}
			}


		}
	});	
});

server.listen( 8080 );