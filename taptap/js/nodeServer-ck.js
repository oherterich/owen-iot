var socket=require("socket.io"),express=require("express"),http=require("http"),app=express(),server=http.createServer(app),io=socket.listen(server),players=[],rooms=[],bGameStarted=!1,numReady=0,Player=function(e,t,n,r){this.client=e;this.id=t;this.name=n;this.score=r;this.ready=!1},Room=function(e,t){this.name=e;this.password=t;this.bGameStarted=!1;this.players=[];this.numReady=0};io.sockets.on("connection",function(e){e.emit("id",{id:e.id});e.on("new room",function(t){e.join(t.name);e.room=t.name;var n=new Room(t.name,t.password);n.players.push(e);rooms.push(n);e.emit("controls on");e.broadcast.emit("room-list",{name:t.name})});e.on("join room",function(t){for(var n=0;n<rooms.length;n++)if(rooms[n].name==t.roomname)if(rooms[n].password==t.password){e.join(t.roomname);e.room=t.roomname;for(var r=0;r<rooms[n].players.length;r++)e.emit("new player",{id:rooms[n].players[r].id,name:rooms[n].players[r].name,color:rooms[n].players[r].color});rooms[n].players.push(e);e.emit("joined room");e.broadcast.to(rooms[n].name).emit("new player",{id:e.id,name:e.name,color:e.color})}else e.emit("wrong password")});e.on("new player info",function(t){players.push(new Player(e,e.id,t.name,0));e.name=t.name;e.score=0;e.ready=!1;e.color=t.color;for(var n=0;n<rooms.length;n++)rooms[n].bGameStarted==0&&e.emit("room-list",{name:rooms[n].name})});e.on("click",function(t){for(var n=0;n<rooms.length;n++)if(e.room==rooms[n].name&&rooms[n].bGameStarted)for(var r=0;r<rooms[n].players.length;r++)if(rooms[n].players[r].id==e.id){rooms[n].players[r].score++;e.broadcast.to(rooms[n].name).emit("point",{id:rooms[n].players[r].id,name:rooms[n].players[r].name})}});e.on("ready",function(t){e.ready=t.ready;for(var n=0;n<rooms.length;n++)if(e.room==rooms[n].name){t.ready?rooms[n].numReady++:rooms[n].numReady--;rooms[n].numReady<rooms[n].players.length?rooms[n].players[0].emit("waiting for players"):rooms[n].players[0].emit("players ready")}});e.on("begin game",function(){for(var t=0;t<rooms.length;t++)if(e.room==rooms[t].name&&rooms[t].numReady==rooms[t].players.length){rooms[t].bGameStarted=!0;io.sockets.in(rooms[t].name).emit("begin game");e.emit("controls off");e.broadcast.emit("remove room",{name:e.room})}});e.on("disconnect",function(t){console.log(e.id+" has disconnected!");for(var n=0;n<rooms.length;n++)if(e.room==rooms[n].name)for(var r=0;r<rooms[n].players.length;r++)if(e.id==rooms[n].players[r].id){e.broadcast.to(rooms[n].name).emit("player left",{id:e.id,name:e.name});rooms[n].players.splice(r,1);rooms[n].players.length>0&&rooms[n].bGameStarted==0&&rooms[n].players[0].emit("controls on",{message:"You are now the leader!"})}})});server.listen(8080);