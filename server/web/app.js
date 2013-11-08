/*
require.paths.unshift(__dirname + '/../../lib')
require.paths.unshift(__dirname + '/../../lib/support/express/lib')
require.paths.unshift(__dirname + '/../../lib/support/hashlib/build/default')
require.("express/plugins")
*/
var express = require("express");
var graph = require("fbgraph");
var redis = require("redis");
var socketio = require("socket.io");
var io = socketio.listen(80); //Warning: listen EACCES
var redis_port = "27071";
var redis_host = "54.249.9.214";
var fs = require("fs");
var exec = require("child_process").exec;
var util = require("util");

function randomString() {
	var chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz0123456789";
	var rstring = "", len = 32;
	for (var i = 0; i < len; i++) {
		rstring += chars[(Math.floor(Math.random() * 62))];
	}
	return rstring;
}

io.sockets.on("connection", function(socket) {
	var client = redis.createClient(redis_port, redis_host);
	var redis_socket = socketio.connect(redis_host);
	var key = randomString();
	while (key in client.get("keys")) {
		key = randomString();
	}
	
	/* in case modifying pre-composed files*/
	socket.on("open", function(file_name) {
		key = file_name;
		if (client.keys.indexOf(key) < 0) {
			redis_socket.emit("load", key);
		}
	});
	socket.on("put", function(data, index) {
		client.linsert(key, index, data)
	});
	socket.on("pop", function(index) {
		client.pop(index);
	});

	socket.on("requestMidiFile", function(key) {
		/*get it from redis*/
		socket.emit("sendMidiFile", file);
	});

	//------------saving midi data by either midiuploader or composer-----------

	socket.on('saveMidiFile', function () {
		var MidiObject;

		socket.emit('startSave');
		socket.on("midiData", function (data) {
			MidiObject.id = data.owner + "_" +  key
			MidiObject.title = data.title; //console.log(data.title);
			MidiObject.playtime = data.playtime; //console.log(data.playtime);
			MidiObject.owner = data.owner; //console.log(data.owner);
			MidiObject.artist = data.artist; //console.log(data.artist);
			MidiObject.description = data.description; //console.log(data.description);
			client.rpush(key, data.MidiFile);
			redis_socket.emit("dump", MidiObject.id);
			//console.dir(data.MidiFile);
			MidiObject.MidiFileId = MidiObject.id;

			//code to upload album art file and get its URL
			var fs = require('fs');
			//path to store uploaded files (NOTE: presumed you have created the folders)
			//NOTE: data.albumArtName may collide with existing file;
			var fileName = __dirname + '/tmp/albumArt/' + data.albumArtName;

			fs.open(fileName, 'a', 0755, function(err, fd) {
	        		//'a': probably append mode; 0755: permission
	        		if (err) throw err;
	        		fs.write(fd, data.albumArt, null, 'Binary', function(err, written, buff) {
					fs.close(fd, function() {
						console.log('File saved successful!');
						MidiObject.albumArt = 'soundpancake.io/media/albumArt/' + data.albumArtName;
	                		});
	            		});
	        	});	
		});

		//TODO: code to push MidiObject into DB


	});
	//--------------------------------------------------------------------------

	socket.on("save", function() {
		socket.on("file_name", function(file_name, meta) {
			if (file_name != key) {
				client.rename(key, file_name);
				key = file_name;
			}
			client.lpush(key, meta);
			redis_socket.emit("dump", key);
		});
	});
});
		
var application_root = "/home/ubuntu/Pancake/app/";
var app = express();

app.configure(function () {
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(application_root));
	app.use(express.static("/media", "/tmp/"));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get("/mypage", function(req, res) {
	res.render("mypage", {id: "xarus"});
});

app.post("/api/query/musiclist", function(req, res) {
	console.log("hello world");
	/*parse req.body.blah query to mongo*/
});

app.post("/api/auth/login", function(req, res) {
	console.log(JSON.stringify(req));
	res.redirect('/');
});

app.post("/api/auth/fb-session", function(req, res) {
	console.log(JSON.stringify(req));
	res.redirect('/');
});

app.post("/api/auth/fb", function(req, res) {
	console.log(JSON.stringify(req));
	res.redirect('/');
});

app.listen(3000);
console.log("listening on port 3000");
