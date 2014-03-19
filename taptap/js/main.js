var main = document.getElementById("main");
var controls = document.getElementById("controls");
var newPlayer = document.getElementById("newplayer");
var create = document.getElementById("create");
var submit = document.getElementById("submit");
var playerList = document.getElementById("playerlist");
var playerTable = document.getElementById("playerlist").childNodes[1];
var ready = document.getElementById("ready");
var bIsReady = false;
var id;
var bGameStarted = false;
var players = [];

var maxTaps = 10;
var maxBlink = 2000;
var blink;
var startColor, endColor, switchColor;
var duration = 1000000000;

var explosion = document.getElementById("explosion");

var red = Math.floor(Math.random()*190);
var green = Math.floor(Math.random()*190);
var blue = Math.floor(Math.random()*190);
var color = "rgb(" + red + "," + green + "," + blue + ")";
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

//Color interpolation function | Created by p11y
//Found here: http://stackoverflow.com/questions/11292649/javascript-color-animation
lerp = function(a, b, u) {
    return (1 - u) * a + u * b;
};

fade = function(element, property, start, end, duration) {
	console.log("start fade!");
    var interval = 10;
    var steps = duration / interval;
    var step_u = 1.0 / steps;
    var u = 0.0;
    var theInterval = setInterval(function() {
        if (u >= 1.0) {
            clearInterval(theInterval);
            switchColor = !switchColor;
            	console.log("end fade!");
        }
        var r = Math.round(lerp(start.r, end.r, u));
        var g = Math.round(lerp(start.g, end.g, u));
        var b = Math.round(lerp(start.b, end.b, u));
        var colorname = 'rgb(' + r + ',' + g + ',' + b + ')';
        element.style.setProperty(property, colorname);
        u += step_u;
    }, interval);
};