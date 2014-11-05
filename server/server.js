var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io')(server),
	_ = require('lodash'),
	sockets = [];

app.use('/client', express.static('../front'));

io.on('connection', function(socket){
	console.log("user connected");
	socket.on('username', function(name){
		socket.username = name;
		sockets.push(socket);
		io.emit('newUser', name);	
	});

	socket.on('getUsers', function() {
		socket.emit('allUsers', _.pluck(sockets, 'username'));
		console.log("users");
		console.log(_.pluck(sockets, 'username'));
	})
	
	socket.on('message', function(msg){
		console.log(msg);
		var messageData = {
			user: socket.username,
			message: msg
		}
    	io.emit('message', messageData);
	});
});



server.listen(3000);
console.log("server is running");