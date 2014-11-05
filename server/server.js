var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io')(server);

app.use('/client', express.static('../front'));

app.get('/', function(req, res) {
	res.send("hello world");
})

io.on('connection', function(){
	 /* … */ 
});
server.listen(3000);
console.log("server is running");