var express = require("express");
var graph = require("fbgraph");
var redis = require("redis");
var application_root = "/home/ubuntu/Pancake/app/";

var app = express();
var server = require('http').createServer(app);
var io_client = require('socket.io-client');
var redis_socket = io_client.connect("http://54.249.9.214", {port: 5000});

server.listen(3000);
var io = require("socket.io").listen(server);

var MongoClient = require("mongodb").MongoClient;
var redis_port = "8081";
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

redis_socket.on("connect", function() {console.log("connection with redis good");});

io.set("transports", ["websocket", "xhr-polling", "jsonp-polling"]);
/*
io.set('transports', [
    'websocket'
  , 'flashsocket'
  , 'htmlfile'
  , 'xhr-polling'
  , 'jsonp-polling'
]);
*/
io.sockets.on("connection", function(socket) {
	console.log("a connection created!");
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
		var file = client.get(key);
		socket.emit("sendMidiFile", file);
	});

	/* TODO:liked */
	var midiId, response;
	socket.on("like", function(mid) {
		var return_data;
		midiId = mid.substring(1);
	});
	var M = MongoClient.connect("mongodb://54.250.177.173/soundpancake", function(err, db) {
			if(err) throw err;
			var collection = db.collection("MIDIObject");
			collection.save({id: midiId}, {$inc: {liked: 1}}, function(err, res) {
				if(err) throw err;
				db.close();
			});
		});


/*		if (0 <= mid.search("_")) {
			var M = MongoClient.connect("mongodb://54.250.177.173/soundpancake", function(err, db) {
				if(err) throw err;
				var collection = db.collection("MIDIObject");
				collection.find({id: mid}).toArray(function(err, results) {
					console.dir(results);
//				collection.update({id: mid}, {$inc : {liked: 1}}, function(err, re) {
//					if (err) throw err;
//					console.log("updated");
//					console.dir(re);
//				});
//				collection.find().toArray(function(er, result) {
//					if (er) throw er;
//					socket.emit("liked", result[0].liked); //Integer
//				});
				});
				db.close();
			});
		} else if (0 <= mid.search("-")) {
			var MC = MongoClient.connect("mongodb://54.250.177.173/soundpancake", function(err, db) {
				if(err) throw err;
				var collection = db.collection("MIDIPlaylist");
				collection.update({id: id}, {$inc : {liked: 1}}, function(err, re) {});
				collection.find({id: id}).toArray(function(err, result) {
					socket.emit("liked", result[0].liked); //Integer
				});
				db.close();
			});

		}
	});*/

	//------------saving midi data by either midiuploader or composer-----------

	socket.on('saveMidiFile', function () {
		var MidiObject =	{
					id: "",
					title: "",
					playtime: "", 
					owner: "", 
					artist: "", 
					description: "",
					data: [],
					liked: 0
					};

		socket.emit('startSave');
		socket.on("midiData", function (data) {
			MidiObject.id = data.owner + "_" +  key
			MidiObject.title = data.title; //console.log(data.title);
			MidiObject.playtime = data.playtime; //console.log(data.playtime);
			MidiObject.owner = data.owner; //console.log(data.owner);
			MidiObject.artist = data.artist; //console.log(data.artist);
			MidiObject.description = data.description; //console.log(data.description);
			MidiObject.data = data.MidiFile;
			MidiObject.MidiFileId = key;
//			MidiObject.liked = data.liked;
			var fileName = __dirname + '/tmp/albumArt/' + data.albumArtName;

			fs.open(fileName, 'a', 0755, function(err, fd) {
	        		//'a': probably append mode; 0755: permission
	        		if (err) throw err;
	        		fs.write(fd, data.albumArt, null, 'Binary', function(err, written, buff) {
					fs.close(fd, function() {
						console.log('File saved successful!');
						MidiObject.albumArt = '/media/albumArt/' + data.albumArtName;
	                		});
	            		});
	        	});	

			MongoClient.connect("mongodb://54.250.177.173/soundpancake", function (err, db) {
				if(err) throw err;
				var collection = db.collection("MIDIObject");
				collection.insert(MidiObject, function(err, insert) {
					console.log(insert);
				});
				db.close();
			});
		});
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
		


app.configure(function () {
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(application_root));
	app.use("/media", express.static("/home/ubuntu/Pancake/server/web/tmp/"));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	//app.use(express.logger());
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
//	console.log(req.body.name.trim());	
	console.log("In musiclist");
	console.log(req.body);
	var res_send = [];
	var MC = MongoClient.connect("mongodb://54.250.177.173/soundpancake", function(err, db) {
		if(err) throw err;
		var collection = db.collection("MIDIObject");
		if( req.body.name === undefined ) {
			collection.find().toArray(function(err, re) {
				if(err) throw err;
				console.log(re);
				if (req.body.id) {
					for (o in re) {
						if (req.body.id == o.title.split("_")[0]) {
							res_send.push(o);
						}
					}
				} else {
					res_send = re;
				}
				db.close();		
				res.send(200, {list: res_send});
			});
		} else {
			collection.find({title: req.body.name.trim()}).toArray(function(err, re) {
				if(err) throw err;
				console.log(re);
				res_send = re;
				db.close();
				res.send(200, {list: res_send});
			});
		}
	});
});

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
//		if(dump.toArray().length = 0 || ) {
//			collection.insert(data.authResponse);
//		}
	});

	res.redirect('/');
});

app.post("/api/auth/fb", function(req, res) {
	data = JSON.parse(req);
	MongoClient.connect("mongodb://blah/dbname", function (err, db) {
		if(err) throw err;
		var collection = db.collection("fb");
		if(collection.find({"id": data.id}).toArray().length = 0) {
			collection.insert(data);
		}
	});
	res.redirect('/');
});

console.log("listening on port 80/3000");
