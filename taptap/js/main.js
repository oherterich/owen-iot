var main = document.getElementById("main");
var controls = document.getElementById("controls");
var create = document.getElementById("create");
var playerList = document.getElementById("playerlist");
var playerTable = document.getElementById("playerlist").childNodes[1];
var id;
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

var removeCreate = function() {
	create.classList.remove('create-visible');
	create.classList.add('create-hidden');
}

var createPlayer = function( id, name, color, score ) {
	var p = new Player( id, name, color, score );
	players.push( p );

	var row = document.createElement("tr");
	
	var playerName = document.createElement("td");
	playerName.innerHTML = name;
	row.appendChild( playerName );

	var score = document.createElement("td");
	score.innerHTML = 0;
	row.appendChild( score );

	playerTable.appendChild(row);
}