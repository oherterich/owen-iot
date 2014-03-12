var main = document.getElementById("main");
var controls = document.getElementById("controls");
var newPlayer = document.getElementById("newplayer");
var create = document.getElementById("create");
var playerList = document.getElementById("playerlist");
var playerTable = document.getElementById("playerlist").childNodes[1];
var ready = document.getElementById("ready");
var bIsReady = false;
var id;
var bGameStarted = false;
var players = [];

var color = '#'+Math.floor(Math.random()*16777215).toString(16);
main.style.background = color;

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

var removeCreate = function() {
	create.classList.remove('create-visible');
	create.classList.add('create-hidden');
}

var addPlayerList = function() {
	playerList.classList.remove('playerlist-hidden');
	playerList.classList.add('playerlist-visible');
}

var removePlayerList = function() {
	playerList.classList.remove('playerlist-visible');
	playerList.classList.add('playerlist-hidden');	
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

var createPlayer = function( id, name, color, score ) {
	var row = document.createElement("tr");
	row.id = "player" + players.length;
	
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