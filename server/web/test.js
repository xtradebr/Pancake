var MongoClient = require("mongodb").MongoClient;
var res_send = MongoClient.connect("mongodb://54.250.177.173/soundpancake", function(err, db) {
	if(err) throw err;
	var collection = db.collection("MidiObject");
	collection.find().toArray(function(err, re) {
		console.dir(re);
		db.close();
	});
});
