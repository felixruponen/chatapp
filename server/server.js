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
		console.log(socket.id);
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

	socket.on('disconnect', function() {
		
		console.log("user disconnected");
		var index = _.indexOf(sockets, socket);
		sockets.splice(index, 1);
		console.log(index);
		_.each(sockets, function(s) {
			console.log(s.username);
		})
		io.emit('allUsers', _.pluck(sockets, 'username'));
	    io.emit('message','user disconnected');
	});
});





server.listen(3000);
console.log("server is running");