var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.get('/', function(req, res) {
	res.send("hello world");
})

io.on('connection', function(){
	 /* … */ 
});
server.listen(3000);