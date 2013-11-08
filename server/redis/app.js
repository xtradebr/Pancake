var MongoClient = require('mongodb').MongoClient;
var GridStore = require("mongodb").GridStore;
var client = require("redis").createClient();
var fs = require("fs");
var socketio = require("socket.io");
var io = socketio.listen(80);

io.sockets.on("connection", function(socket) {
	socket.on("load", function(file_name) {
		/*TODO*/
	});
	socket.on("dump", function(file_name) {
		meta = client.lrange(file_name, 0, 0)[0];
		data = client.lrange(file_name, 1, client.get(file_name).length - 1);
		MongoClient.connect("mongodb://54.250.177.173:27017/soundpancake", function(err, db) {
			if(err) return console.dir(err);
			var collection = db.collection("MIDIObject");
			collection.insert({
						fileID: file_name,
						midiID: file_name,
						tags: meta
						}, function(err, docs) {});
			new GridStore(db, file_name, "w").open(function(err, gs) {
				gs.write(JSON.stringify(data), function(err, gs) {
					gs.close();
				});
			});
		});
	});
});
