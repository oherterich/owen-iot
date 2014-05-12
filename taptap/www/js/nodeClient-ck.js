function setBackground(){main.style.background="#ffffff"}var socket=io.connect("http://"+window.location.hostname+":8080");socket.on("id",function(e){id=e.id;addPlayer(id,"Me",main.style.background,0)});socket.on("new player",function(e){addPlayer(e.id,e.name,e.color,0);newPlayer.innerHTML="<p>The new player "+e.name+" has joined.</p>";console.log(e.id+" | "+e.name+" | "+e.color)});socket.on("controls on",function(e){turnOnControls();addReady()});socket.on("controls off",function(){turnOffControls()});socket.on("begin game",function(){bGameStarted=!0;addPlayerList();removeReady();newPlayer.innerHTML="";main.style.background=color});socket.on("waiting for players",function(){console.log("not ready!");controls.classList.add("controls-waiting");controls.classList.remove("controls-ready");controls.innerHTML="<h1>Waiting</h1>"});socket.on("players ready",function(){console.log("ready!");controls.classList.add("controls-ready");controls.classList.remove("controls-waiting");controls.innerHTML="<h1>Start</h1>"});socket.on("point",function(e){for(var t=0;t<players.length;t++)if(players[t].id==e.id){console.log(players[t].name+" | "+t);players[t].score++;document.getElementById("player"+t).childNodes[1].innerHTML=players[t].score}});main.addEventListener("touchstart",function(e){if(bGameStarted){socket.emit("click",{message:"I just clicked!"});players[0].score++;document.getElementById("player0").childNodes[1].innerHTML=players[0].score;duration=(1-players[0].score/maxTaps)*1e3;main.style.background=color;switchColor=!1;window.clearInterval(blink);blink=setInterval(function(){if(switchColor){startColor={r:255,g:255,b:255};endColor={r:red,g:green,b:blue}}else{startColor={r:red,g:green,b:blue};endColor={r:255,g:255,b:255}}fade(main,"background",startColor,endColor,duration)},duration);players[0].score<10?explosion.play():gameoversound.play()}});controls.addEventListener("touchstart",function(e){socket.emit("begin game")});createPlayer.addEventListener("keydown",function(e){if(e.keyCode==13){var t=document.querySelector("input");socket.emit("new player info",{name:t.value,color:main.style.background});removeCreatePlayer();addRoom()}});submitName.addEventListener("touchstart",function(e){e.preventDefault();e.stopPropagation();console.log("submit name");var t=document.querySelector("input");socket.emit("new player info",{name:t.value,color:main.style.background});removeCreatePlayer();addRoom()});ready.addEventListener("touchstart",function(e){toggleReady();socket.emit("ready",{ready:bIsReady})});submitRoom.addEventListener("touchstart",function(e){e.preventDefault();e.stopPropagation();var t=document.getElementById("roomname"),n=document.getElementById("password");socket.emit("new room",{name:t.value,password:n.value});removeRoom()});socket.on("room-list",function(e){console.log(e.name);var t=document.createElement("p");t.innerHTML=e.name;t.classList.add("current-room");t.addEventListener("click",function(e){addPassword();removeRoom();selectedRoom=t.innerHTML});roomList.appendChild(t)});socket.on("remove room",function(e){var t=document.getElementsByClassName("current-room");for(var n=0;n<t.length;n++)if(t[n].innerHTML==e.name){t[n].parentNode.removeChild(t[n]);console.log("removed "+e.name)}console.log("received the remove command")});submitPassword.addEventListener("touchstart",function(e){var t=document.getElementById("password-input");socket.emit("join room",{roomname:selectedRoom,password:t.value});removePassword();joinRoom.classList.remove("join-visible");joinRoom.classList.add("join-hidden")});socket.on("wrong password",function(e){var t=document.createElement("p");t.innerHTML="Wrong password. Try again!";passwordBox.appendChild(t);addPassword()});socket.on("joined room",function(e){addReady()});socket.on("player left",function(e){var t=document.getElementsByClassName("player-row");for(var n=0;n<t.length;n++)if(t[n].childNodes[0].innerHTML==e.name){var r=t[n];r.parentNode.removeChild(r)}});socket.on("game over",function(){bGameStarted=!1;window.clearInterval(blink);playerList.classList.remove("player-active");playerList.classList.add("player-gameover");gameover.classList.remove("hidden");gameover.classList.remove("visible");setTimeout(setBackground,100)});socket.on("winner",function(){bGameStarted=!1;window.clearInterval(blink);youwin.classList.remove("hidden");youwin.classList.add("visible");restart.classList.remove("hidden");restart.classList.add("visible");setTimeout(setBackground,100)});restart.addEventListener("touchstart",function(e){socket.emit("restart");bGameStarted=!1;bIsReady=!1;for(var t=0;t<players.length;t++){players[t].score=0;document.getElementById("player"+t).childNodes[1].innerHTML=players[t].score}youwin.classList.remove("visible");youwin.classList.add("hidden");gameover.classList.remove("visible");gameover.classList.add("hidden");restart.classList.remove("visible");restart.classList.add("hidden");ready.classList.add("ready-false");ready.classList.remove("ready-true");addReady();removePlayerList()});socket.on("restart",function(){bGameStarted=!1;bIsReady=!1;for(var e=0;e<players.length;e++){players[e].score=0;document.getElementById("player"+e).childNodes[1].innerHTML=players[e].score}youwin.classList.remove("visible");youwin.classList.add("hidden");gameover.classList.remove("visible");gameover.classList.add("hidden");playerList.classList.remove("player-gameover");playerList.classList.add("player-active");ready.classList.add("ready-false");ready.classList.remove("ready-true");addReady();removePlayerList()});