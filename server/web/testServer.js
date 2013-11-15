var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(8080);

app.get('/', function(req, res) {
	res.sendfile('home/ubuntu/Pancake/app/index.html');
});

io.sockets.on('connection', function(socket) {

	console.log('in connection');

	socket.emit('test', { hello: 'world' });
	socket.on('my other event', function(data) {
		console.log(data);
	});
});
