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
		io.emit('newUser', {
			username: socket.username,
			id: socket.id
		});	
		console.log(socket.id);
	});

	socket.on('getUsers', function() {
		socket.emit('allUsers', _.map(sockets, function(socket) { return { username: socket.username, id: socket.id}; }));
		console.log("users");
	});
	
	socket.on('message', function(msg) {
		var messageData = {
			user: socket.username,
			message: msg.message,
			to: msg.to
		};

		if(msg.to == 'all') {
			messageData.visibility = 'public';
			io.emit('message', messageData);
		} else {
			messageData.visibility = 'private';
			_.each(sockets, function(s) {
				console.log(s.id);
				console.log(msg.to);
				if (s.id == msg.to) {
					s.emit('message', messageData);
				}
			});
			socket.emit('message', messageData);
		}
		console.log(msg);
	
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