var main = document.getElementById("main");
var controls = document.getElementById("controls");
var newPlayer = document.getElementById("newplayer");
var createPlayer = document.getElementById("create-player");
var submitName = document.getElementById("submit-name");
var playerList = document.getElementById("playerlist");
var playerTable = document.getElementById("playerlist").childNodes[1];
var ready = document.getElementById("ready");
var room = document.getElementById("room");
var joinRoom = document.getElementById("join-room");
var joinRoomButton = document.getElementById('join-room-button');
var joinBack = document.getElementById('join-back');
var createRoom = document.getElementById("create-room");
var createRoomButton = document.getElementById('create-room-button');
var roomForm = document.getElementById('room-form')
var joinRoom = document.getElementById("join-room");
var roomList = document.getElementById('room-list');
var arrowUp = document.getElementById('arrowup');
var arrowDown = document.getElementById('arrowdown');
var passwordBox = document.getElementById("password-box");
var passwordBack = document.getElementById("password-back");
var submitPassword = document.getElementById("password-submit");
var submitRoom = document.getElementById("submit-newroom");
var gameOver = document.getElementById('gameover');
var youWin = document.getElementById('youwin');
var restart = document.getElementById('restart');
var selectedRoom;
var bIsReady = false;
var id;
var bGameStarted = false;
var players = [];

var maxTaps = 10;
var maxBlink = 2000;
var blink;
var startColor, endColor;
var switchColor = false;
var duration = 1000000000;

var explosion = new Audio('assets/explosion.mp3');
var gameoversound = new Audio('assets/gameover.mp3');

var red = Math.floor(Math.random()*190);
var green = Math.floor(Math.random()*190);
var blue = Math.floor(Math.random()*190);
var color = "rgb(" + red + "," + green + "," + blue + ")";
//main.style.background = color;

var Player = function( id, name, color, score) {
	this.id = id;
	this.name = name;
	this.color = color;
	this.score = score;
}

var turnOnControls = function() {
	controls.classList.remove('controls-hidden');
	controls.classList.add('controls-visible');
}

var turnOffControls = function() {
	controls.classList.remove('controls-visible');
	controls.classList.add('controls-hidden');	
}

var removeCreatePlayer = function() {
	createPlayer.classList.remove('createPlayer-visible');
	createPlayer.classList.add('createPlayer-hidden');
}

var addPlayerList = function() {
	playerList.classList.remove('hidden');
	playerList.classList.add('visible');
}

var removePlayerList = function() {
	playerList.classList.remove('visible');
	playerList.classList.add('hidden');	
}

var addReady = function() {
	ready.classList.remove('ready-hidden');
	ready.classList.add('ready-visible');
}

var removeReady = function() {
	ready.classList.remove('ready-visible');
	ready.classList.add('ready-hidden');
}

var toggleReady = function() {
	ready.classList.toggle('ready-false');
	ready.classList.toggle('ready-true');
	bIsReady = !bIsReady;
}

var addRoom = function() {
	room.classList.add('room-visible');
	room.classList.remove('room-hidden');
}

var removeRoom = function() {
	room.classList.add('room-hidden');
	room.classList.remove('room-visible');
}

var addPassword = function() {
	passwordBox.classList.add('password-visible');
	passwordBox.classList.remove('password-hidden');
}

var removePassword = function() {
	passwordBox.classList.add('password-hidden');
	passwordBox.classList.remove('password-visible');
}

var showCreateRoom = function() {
	roomForm.classList.toggle('room-form-visible');
	roomForm.classList.toggle('room-form-hidden');
	joinRoomButton.classList.toggle('join-visible');
	joinRoomButton.classList.toggle('join-hidden');
}

var showJoinRoom = function() {
	createRoom.classList.remove('room-form-visible');
	createRoom.classList.add('room-form-hidden');
	joinRoomButton.classList.add('join-hidden');
	joinRoomButton.classList.remove('join-visible');
	joinRoom.classList.toggle('join-visible');
	joinRoom.classList.toggle('join-hidden');
}

createRoomButton.addEventListener('touchstart', function(evt) {
	showCreateRoom();
});

joinRoomButton.addEventListener('touchstart', function(evt) {
	showJoinRoom();
});

joinBack.addEventListener('touchstart', function(evt) {
	createRoom.classList.add('room-form-visible');
	createRoom.classList.remove('room-form-hidden');
	joinRoomButton.classList.remove('join-hidden');
	joinRoomButton.classList.add('join-visible');
	joinRoom.classList.toggle('join-visible');
	joinRoom.classList.toggle('join-hidden');
});

passwordBack.addEventListener('click', function(evt) {
	removePassword();
	addRoom();
});

arrowup.addEventListener('touchstart', function(evt){
	roomList.scrollTop += 30;
});

arrowdown.addEventListener('touchstart', function(evt){
	roomList.scrollTop -= 30;
});

//Function that creates a new player and adds it to the array.
var addPlayer = function( id, name, color, score ) {
	var row = document.createElement("tr");
	row.id = "player" + players.length;
	row.classList.add( "player-row");
	
	var playerName = document.createElement("td");
	playerName.innerHTML = name;
	row.appendChild( playerName );

	var playerScore = document.createElement("td");
	playerScore.innerHTML = 0;
	row.appendChild( playerScore );

	playerTable.appendChild(row);

	var p = new Player( id, name, color, score );
	players.push( p );
}

//Color interpolation function | Created by p11y
//Found here: http://stackoverflow.com/questions/11292649/javascript-color-animation
lerp = function(a, b, u) {
    return (1 - u) * a + u * b;
};

fade = function(element, property, start, end, duration) {
	if (!bGameStarted) { 
		main.style.background = color;
		return;
	}
    var interval = 10;
    var steps = duration / interval;
    var step_u = 1.0 / steps;
    var u = 0.0;
    var theInterval = setInterval(function() {
        if (u >= 1.0) {
            clearInterval(theInterval);
            switchColor = !switchColor;
        }
        var r = Math.round(lerp(start.r, end.r, u));
        var g = Math.round(lerp(start.g, end.g, u));
        var b = Math.round(lerp(start.b, end.b, u));
        var colorname = 'rgb(' + r + ',' + g + ',' + b + ')';
        element.style.setProperty(property, colorname);
        u += step_u;
    }, interval);
};