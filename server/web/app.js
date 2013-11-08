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

	//------------saving midi data by either midiuploader or composer-----------

	var MidiObject;
	socket.on('saveMidiFile', function () {
		socket.emit('startSave');

		socket.on("midiData", function (data) {

			MidiObject.title = data.title; //console.log(data.title);
			MidiObject.playtime = data.playtime; //console.log(data.playtime);
			MidiObject.owner = data.owner; //console.log(data.owner);
			MidiObject.artist = data.artist; //console.log(data.artist);
			MidiObject.description = data.description; //console.log(data.description);

			//TODO: save data.MidiFile into DB and pass its Id
			//console.dir(data.MidiFile);
			//MidiObject.MidiFileId = 

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
	                    //console.log('File saved successful!');
	                    //HERE:나중에 서버에서 이미지 리사이즈해서 보여줄 것을 생각한 place marker.

	                	//TODO: get the url for uploaded album art
	                	//MidiObject.albumArt = 'URL';
	                })
	            })
	        })
			
		})

		//TODO: code to push MidiObject into DB
		//어제 이야기했던 MidiObject가 title이 아닌 id가 있어야 한다는 부분은
		//아래 코드가 안바뀐것 같네. 그건 수정해주고, 생성한 id는 아래처럼.
		//MidiObject.id = ???

	}
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

var conf = {
	client_id:      'YOUR FACEBOOK APP ID',
	client_secret:  'YOU FACEBOOK APP SECRET',
	scope:          'email, user_about_me, user_birthday, user_location, publish_stream',
	redirect_uri:   'http://localhost:3000/auth/facebook'
};

app.configure(function () {
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(application_root));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get("/auth/facebook", function(req, res) {
	if(!req.query.code) {
		var authUrl = graph.getOauthUrl({
			"client_id": conf.client_id,
			"redirect_uri": conf.redirect_uri,
			"scope": conf.scope
		});
		if(!req.query.error) {
			res.redirect(authUrl);
		} else {
			res.send("access denied");
		}
		return;
	}
	graph.authorize({
		"client_id": conf.client_id,
		"redirect_uri": conf.redirect_uri,
		"client_secret": conf.client_secret,
		"code": req.query.code
	}, function(err, fbRes) {
		res.redirect("/mypage");
	});
});

app.get("/mypage", function(req, res) {
	res.render("mypage", {id: "xarus"});
});

app.get("/api/filter", function(req, res) {
	/*parse req.body.blah query to mongo*/
});

app.listen(3000);
console.log("listening on port 3000");
