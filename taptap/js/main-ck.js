var main=document.getElementById("main"),controls=document.getElementById("controls"),newPlayer=document.getElementById("newplayer"),createPlayer=document.getElementById("create-player"),submitName=document.getElementById("submit-name"),playerList=document.getElementById("playerlist"),playerTable=document.getElementById("playerlist").childNodes[1],ready=document.getElementById("ready"),room=document.getElementById("room"),joinRoom=document.getElementById("join-room"),createRoom=document.getElementById("create-room"),joinRoom=document.getElementById("join-room"),passwordBox=document.getElementById("password-box"),submitPassword=document.getElementById("password-submit"),submitRoom=document.getElementById("submit-newroom"),bIsReady=!1,id,bGameStarted=!1,players=[],maxTaps=10,maxBlink=2e3,blink,startColor,endColor,switchColor,duration=1e9,explosion=document.getElementById("explosion"),red=Math.floor(Math.random()*190),green=Math.floor(Math.random()*190),blue=Math.floor(Math.random()*190),color="rgb("+red+","+green+","+blue+")";main.style.background=color;var Player=function(e,t,n,r){this.id=e;this.name=t;this.color=n;this.score=r},turnOnControls=function(){controls.classList.remove("controls-hidden");controls.classList.add("controls-visible")},turnOffControls=function(){controls.classList.remove("controls-visible");controls.classList.add("controls-hidden")},removeCreatePlayer=function(){createPlayer.classList.remove("createPlayer-visible");createPlayer.classList.add("createPlayer-hidden")},addPlayerList=function(){playerList.classList.remove("playerlist-hidden");playerList.classList.add("playerlist-visible")},removePlayerList=function(){playerList.classList.remove("playerlist-visible");playerList.classList.add("playerlist-hidden")},addReady=function(){ready.classList.remove("ready-hidden");ready.classList.add("ready-visible")},removeReady=function(){ready.classList.remove("ready-visible");ready.classList.add("ready-hidden")},toggleReady=function(){ready.classList.toggle("ready-false");ready.classList.toggle("ready-true");bIsReady=!bIsReady},addRoom=function(){room.classList.add("room-visible");room.classList.remove("room-hidden")},removeRoom=function(){room.classList.add("room-hidden");room.classList.remove("room-visible")},addPassword=function(){passwordBox.classList.add("password-visible");passwordBox.classList.remove("password-hidden")},removePassword=function(){passwordBox.classList.add("password-hidden");passwordBox.classList.remove("password-visible")},addPlayer=function(e,t,n,r){var i=document.createElement("tr");i.id="player"+players.length;var s=document.createElement("td");s.innerHTML=t;i.appendChild(s);var o=document.createElement("td");o.innerHTML=0;i.appendChild(o);playerTable.appendChild(i);var u=new Player(e,t,n,r);players.push(u)};lerp=function(e,t,n){return(1-n)*e+n*t};fade=function(e,t,n,r,i){console.log("start fade!");var s=10,o=i/s,u=1/o,a=0,f=setInterval(function(){if(a>=1){clearInterval(f);switchColor=!switchColor;console.log("end fade!")}var i=Math.round(lerp(n.r,r.r,a)),s=Math.round(lerp(n.g,r.g,a)),o=Math.round(lerp(n.b,r.b,a)),l="rgb("+i+","+s+","+o+")";e.style.setProperty(t,l);a+=u},s)};