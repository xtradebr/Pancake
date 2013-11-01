var mongo = require("mongodb");

function query(q) {
	var r, MongoClient = mongo.MongoClient;
	MongoClient.connect("mongodb://127.0.0.1:27021/dbname", function (err, db) {
		if(err) throw err;
		var collection = db.collection("test");
		collection.find("/*query here*/").toArray(/*do something?*/);
//		r = query result;
	});
	return r;
}
