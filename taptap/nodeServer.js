var express = require('express');
var app = express();
var directory = require('serve-index');
var server = require('http').createServer(app)
var io = require('socket.io').listen(server);

var WWW_ROOT = './www';
var SOCKET_IO_PORT = 8080;

server.listen(SOCKET_IO_PORT);

app.use(directory(WWW_ROOT));
app.use(express.static(WWW_ROOT));

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
	this.gameover = false;
}

var Room = function( name, password ) {
	this.name = name;
	this.password = password;
	this.bGameStarted = false;
	this.players = [];
	this.numReady = 0;
	this.numOver = 0;
}

io.sockets.on( 'connection', function( client ) {

	//First, we're sending the unique socket id back to the client.
	client.emit('id', { id: client.id });

	client.on( 'new room', function( data ) {
		client.join( data.name );
		client.room = data.name;

		console.log( 'new room: ' + data.name );

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

					console.log( client.name + ' has joined room ' + data.roomname);

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
		client.gameover = false;

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
							if ( rooms[i].players[j].score >= 10 ) {
								client.emit('game over');
								client.gameover = true;
								rooms[i].numOver++;
								console.log( rooms[i].numOver );

								if ( rooms[i].numOver >= rooms[i].players.length-1) {
									for ( var k = 0; k < rooms[i].players.length; k++ ) {
										if ( rooms[i].players[k].gameover == false ){
											rooms[i].players[k].emit('winner');
										}
									}
								}
							}
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

	client.on( 'restart', function() {
		console.log('restart');
		for (var i = 0; i < rooms.length; i++) {
			if ( client.room == rooms[i].name ) {
				client.broadcast.to(rooms[i].name).emit( 'restart' );

				rooms[i].bGameStarted = false;
				rooms[i].numReady = 0;
				rooms[i].numOver = 0;

				rooms[i].players[0].emit('controls on');

				for ( var j = 0; j < rooms[i].players.length; j++ ){
					rooms[i].players[j].score = 0;
					rooms[i].players[j].gameover = false;
					rooms[i].players[j].ready = false;
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