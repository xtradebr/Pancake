var express = require("express");
var graph = require("fbgraph");
var redis = require("redis");
var socketio = require("socket.io");
var io = socketio.listen(80); //Warning: listen EACCES
var redis_port = "27071";
var redis_host = "54.249.9.214";

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
	socket.on("sendFirstMessage", function(FirstMessage) {
		socket.emit("ready");
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
	socket.on("albumArt", function(name, buffer) {
		/*something here*/
	});
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
