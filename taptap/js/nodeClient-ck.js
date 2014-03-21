var socket=io.connect("http://localhost:8080");socket.on("id",function(e){id=e.id;addPlayer(id,"Me",main.style.background,0)});socket.on("new player",function(e){addPlayer(e.id,e.name,e.color,0);newPlayer.innerHTML="<p>The new player "+e.name+" has joined.</p>";console.log(e.id+" | "+e.name+" | "+e.color)});socket.on("controls on",function(e){turnOnControls();addReady()});socket.on("controls off",function(){turnOffControls()});socket.on("begin game",function(){bGameStarted=!0;addPlayerList();removeReady();newPlayer.innerHTML="";console.log("begin!")});socket.on("waiting for players",function(){console.log("not ready!");controls.classList.add("controls-waiting");controls.classList.remove("controls-ready");controls.innerHTML="<h1>Waiting</h1>"});socket.on("players ready",function(){console.log("ready!");controls.classList.add("controls-ready");controls.classList.remove("controls-waiting");controls.innerHTML="<h1>Start</h1>"});socket.on("point",function(e){for(var t=0;t<players.length;t++)if(players[t].id==e.id){console.log(players[t].name+" | "+t);players[t].score++;document.getElementById("player"+t).childNodes[1].innerHTML=players[t].score}});main.addEventListener("mousedown",function(e){if(bGameStarted){socket.emit("click",{message:"I just clicked!"});players[0].score++;document.getElementById("player0").childNodes[1].innerHTML=players[0].score;explosion.play()}});main.addEventListener("touchstart",function(e){if(bGameStarted){socket.emit("click",{message:"I just clicked!"});players[0].score++;document.getElementById("player0").childNodes[1].innerHTML=players[0].score;explosion.play()}});controls.addEventListener("click",function(e){socket.emit("begin game")});createPlayer.addEventListener("keydown",function(e){if(e.keyCode==13){var t=document.querySelector("input");socket.emit("new player info",{name:t.value,color:main.style.background});removeCreatePlayer();addRoom()}});submitName.addEventListener("click",function(e){e.preventDefault();e.stopPropagation();var t=document.querySelector("input");socket.emit("new player info",{name:t.value,color:main.style.background});removeCreatePlayer();addRoom()});ready.addEventListener("click",function(e){toggleReady();socket.emit("ready",{ready:bIsReady})});submitRoom.addEventListener("click",function(e){e.preventDefault();e.stopPropagation();var t=document.getElementById("roomname"),n=document.getElementById("password");socket.emit("new room",{name:t.value,password:n.value});removeRoom()});socket.on("room-list",function(e){var t=document.createElement("p");t.innerHTML=e.name;t.classList.add("current-room");t.addEventListener("click",function(e){addPassword();removeRoom();selectedRoom=t.innerHTML});joinRoom.appendChild(t)});submitPassword.addEventListener("click",function(e){var t=document.getElementById("password-input");socket.emit("join room",{roomname:selectedRoom,password:t.value});removePassword()});socket.on("wrong password",function(e){var t=document.createElement("p");t.innerHTML="Wrong password. Try again!";passwordBox.appendChild(t);addPassword()});socket.on("joined room",function(e){addReady()});