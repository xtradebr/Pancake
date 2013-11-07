
var io = require('socket.io').listen(8080)
  , fs = require('fs')
  , exec = require('child_process').exec
  , util = require('util')


//페이지 접속시 소켓생성 후 그 소켓으로 통신
io.sockets.on('connection', function (socket) {

	socket.on('sendFirstMessage', function (FirstMessage) {
		socket.emit('ready');
	});	

	socket.on('midiData', function (data) {
		//console.log(data.title);
		//console.dir(data.midiData);
		//receives properly.

		//function to store midi data
	});

	socket.on('albumArt', function (name, buffer) {
		
		var fs = require('fs');
		//path to store uploaded files (NOTE: presumed you have created the folders)
        var fileName = __dirname + '/tmp/albumArt/' + name;

        fs.open(fileName, 'a', 0755, function(err, fd) { //'a': probably append mode; 0755: permission
            if (err) throw err;

            fs.write(fd, buffer, null, 'Binary', function(err, written, buff) {
                fs.close(fd, function() {
                    console.log('File saved successful!');
                });
            })
        });
	});

});
