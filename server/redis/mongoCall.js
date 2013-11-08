var MongoClient = require('mongodb').MongoClient;
var fs = require("fs");
function store(FILEPATH) {
	MongoClient.connect("mongodb://54.250.177.173:27017/soundpancake", function(err, db) {
		if(err) return console.dir(err);
		var gs = new mongodb.Grid(db, "fs");
		var buffer = fs.readFile(FILEPATH);
		gs.put(buffer, {metadata: {category:"something"}, contents_type: "MIDI"}, function(err, fileInfo){
			if(!err) {
				console.log("Finished writing file to Mongo");
			}
		});	
		});
	}

