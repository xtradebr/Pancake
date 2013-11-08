"use strict";

//var uploadSocket = io.connect('http://127.0.0.1:80/');
//uploadSocket.on('connect', function () {
//  uploadSocket.on('ready', function () {
//    console.log('socket connected');
//  })
//});

var player;
MIDI.loadPlugin(function(){
	player = MIDI.Player;
});

var MIDIPlayerPercentage = function() {
        
        var playtime = document.getElementById("playtime");
        var endtime = document.getElementById("endtime");
        var capsule = document.getElementById("capsule");
        var timeCursor = document.getElementById("cursor");
        
        Event.add(capsule, "drag", function (event, self) {
                Event.cancel(event);
                player.currentTime = (self.x) / 420 * player.endTime;
                if (player.currentTime < 0) player.currentTime = 0;
                if (player.currentTime > player.endTime) player.currentTime = player.endTime;
                if (self.state === "down") {
                        player.pause(true);
                } else if (self.state === "up") {
                        player.resume();
                }
        });
        //
        function timeFormatting(n) {
                var minutes = n / 60 >> 0; 
                var seconds = String(n - (minutes * 60) >> 0);
                if (seconds.length == 1) seconds = "0" + seconds;
                return minutes + ":" + seconds;
        }
        
        player.setAnimation(function(data, element) {
                var percent = data.now / data.end;
                var now = data.now >> 0;
                var end = data.end >> 0;
                if (now === end) { // go to next song

                        player.loadFile(song, player.start); // load MIDI
                }
                // display the information to the user
                timeCursor.style.width = (percent * 100) + "%";
                playtime.innerHTML = timeFormatting(now);
                endtime.innerHTML = timeFormatting(end);
        });
};




























