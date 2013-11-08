var redis = require("redis");
var mongo = require("mongo");
function pushToRedis(FILEPATH) {
	var client = redis.createClient(/*port, host, */);
	var midiFile;
	var mongoDB = connect(/*self*/,
		new GridStore(db, /*filename*/, "r").open(function(err, data) {
			midiFile = data;
//			db.close();
	);

/*TODO: parsing code here */
	
	client.on("error", function (err) {
		console.log("Error " + err);
	});

	client.set("string key", "string val", redis.print);
	client.hset("hash key", "hashtest 1", "some value", redis.print);
	client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
	client.hkeys("hash key", function (err, replies) {
		console.log(replies.length + " replies:");
		replies.forEach(function (reply, i) {
			console.log(" " + i + ": " + reply);
		});
		client.quit();
	});
}
