var express = require("express");
var redis = require("redis");
var exec = require("child_process").exec;
var util = require("util");
var fs = require("fs");
var io_client = require('socket.io-client');

var application_root = "/home/ubuntu/Pancake/app/";
var redis_port = "8081";
var redis_host = "54.249.9.214";

var app = express();
var server = require('http').createServer(app);
var io = require("socket.io").listen(server);
server.listen(3000);

var redis_socket = io_client.connect("http://54.249.9.214", {port: 5000});
var MongoClient = require("mongodb").MongoClient;


function randomString() {
	var chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz0123456789";
	var rstring = "", len = 32;
	for (var i = 0; i < len; i++) {
		rstring += chars[(Math.floor(Math.random() * 62))];
	}
	return rstring;
}


function searchAndEmit(socket, collection, query) {
	collection.findOne(query, function(err, res) {
		if (err) throw err;
		if (res.id) {
			collection.save({	_id: res._id,
						id: res.id,
						title: res.title,
						playtime: res.playtime, 
						owner: res.owner, 
						artist: res.artist, 
						description: res.description,
						data: res.data,
						MidiFileId: res.MidiFileId,
						albumArt: res.albumArt,
						like: res.like +1
					}, function(err, res) {});
			socket.emit("liked", res.like +1);
		}
	});
}


redis_socket.on("connect", function() {
//	console.log("connection with redis good");
});


//available list: websocket, flashsocket, htmlfile, xhr-polling, jsonp-polling
io.set("transports", ["xhr-polling", "jsonp-polling"]);


io.sockets.on("connection", function(socket) {
	console.log("a connection created!");
	socket.emit("clear", "hello");
	var client = redis.createClient(redis_port, redis_host);
	var key = randomString();
	var keys = client.get("keys")
	if (keys != false) {
		if (typeof keys == "string") { keys = [keys]; }
		while (key in keys) {
			key = randomString();
		}
	}

	socket.on("test", function(data) {
		console.log("Testing socket connection");
		console.log(data);
	});

//	Deprecated
//	socket.on("open", function(file_name) {
//		key = file_name;
//		if (client.keys.indexOf(key) < 0) {
//			redis_socket.emit("load", key);
//		}
//	});

//	socket.on("put", function(data, index) {
//		client.linsert(key, index, data)
//	});

//	socket.on("pop", function(index) {
//		client.pop(index);
//	});

	socket.on("requestMidiFile", function(key) {
		//TODO
		var file = client.get(key);
		socket.emit("sendMidiFile", file);
	});

	socket.on("like", function(id) {
		MongoClient.connect("mongodb://54.250.177.173/soundpancake", function (err, db) {
			if(err) throw err;
			searchAndEmit(socket, db.collection("MIDIObject"), {id: id});
		});
	});

	socket.on('saveMidiFile', function () {
		var MidiObject = {
					id: "",
					title: "",
					playtime: "", 
					owner: "", 
					artist: "", 
					description: "",
					data: [],
					like: 0
				};
		socket.emit('startSave');
console.log("ready to Save midi");
		socket.on("midiData", function (data) {
			MidiObject.id = data.owner + "_" +  key
			MidiObject.title = data.title;
			MidiObject.playtime = data.playtime;
			MidiObject.owner = data.owner;
			MidiObject.artist = data.artist;
			MidiObject.description = data.description;
			MidiObject.data = data.MidiFile;
			MidiObject.MidiFileId = key;
                        MidiObject.share = 'http://www.soundpancake.io/#!/share/'+MidiObject.id;
			
			console.log("save image file");			

			var fileName = __dirname + '/tmp/albumArt/' + data.albumArtName;
			fs.open(fileName, 'a', 0755, function(err, fd) { //'a': probably append mode; 0755: permission
	        		if (err) throw err;
	        		fs.write(fd, data.albumArt, null, 'Binary', function(err, written, buff) {
					fs.close(fd, function() {
						MidiObject.albumArt = '/media/albumArt/' + data.albumArtName;
	                		});
	            		});
	        	});	
			MongoClient.connect("mongodb://54.250.177.173/soundpancake", function (err, db) {
				if(err) throw err;
				var collection = db.collection("MIDIObject");
				console.log("Saved Midi is ");
				console.log(MidiObject);
				collection.insert(MidiObject, function(err, res) {});
				db.close();
			});
		});
	});
});


app.configure(function () {
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(application_root));
	app.use("/media", express.static("/home/ubuntu/Pancake/server/web/tmp/"));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	//app.use(express.logger());
});

app.post("/api/query/share", function(req, res) {
	var res_send = [];
	var MC = MongoClient.connect("mongodb://54.250.177.173/soundpancake", function(err, db) {

	if(err) throw err;
	var collection = db.collection("MIDIObject");
	
	collection.find({id: req.body.id}).toArray(function(err, re) {
		if(err) throw err;
		res.send(200, {list: re});
		db.close();
		});

	});
});

app.post("/api/query/playlist", function(req, res) {
	var res_send = []
	var MC = MongoClient.connect("mongodb://54.250.177.173/soundpancake", function(err, db) {
		if(err) throw err;
		var collection = db.collection("MIDIPlaylist");
		collection.find({title: req.body.name}).toArray(function(err, re) {
			res_send = re;
			db.close();
			res.send(200, {list: res_send});
		});
	});
});


app.post("/api/query/musiclist", function(req, res) {
	var MC = MongoClient.connect("mongodb://54.250.177.173/soundpancake", function(err, db) {
		if(err) throw err;
		var collection = db.collection("MIDIObject");
		if(!req.body.name) {
			if(req.body.userid) {
				collection.find({owner: req.body.userid}).skip(10*(req.body.page -1)).limit(10).toArray(function(err, re) {
					if (err) throw err;
					res.send(200, {list: re});
					db.close();
				});
			} else {
				collection.find().skip(10*(req.body.page -1)).limit(10).toArray(function(err, re) {
					if (err) throw err;
					res.send(200, {list: re});
					db.close();
				});
			}
		} else {
			collection.find({title: req.body.name}).skip(10*(req.body.page -1)).limit(10).toArray(function(err, re) {
				if(err) throw err;
				res.send(200, {list: re});
				db.close();
			});
		}
	});
});

/*
app.post("/api/auth/login", function(req, res) {
	console.log(JSON.stringify(req));
	res.redirect('/');
});


app.post("/api/auth/fb-session", function(req, res) {
	data = JSON.parse(req);
	MongoClient.connect("mongodb://54.250.177.173/soundpancake", function (err, db) {
		if(err) throw err;
		var collection = db.collection("fb-session");
		dump = collection.find({"UserID": data.authResponse.UserID});
	});
	res.redirect('/');
});
*/

app.post("/api/auth/fb", function(req, res) {
	data = JSON.parse(req);
	MongoClient.connect("mongodb://54.250.177.173/soundpancake", function (err, db) {
		if(err) throw err;
		var collection = db.collection("fb");
		collection.find({"id": data.id}).toArray(function(err, res) {
		 	if(!res.length) {
				collection.insert(data, function(err, res) {});
			}
		});
	});
	res.redirect('/');
});


console.log("listening on port 80/3000");

app.get("/midi/*", function(req, res) {
	console.log("response about " + req.params[0]);
	res.sendfile('./midi/'+req.params[0]);
});
