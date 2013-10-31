"use strict";

/*
	player setup
*/

var player;
MIDI.loadPlugin(function () {
    player = MIDI.Player;
});

MIDIPlayerPercentage(player);

MIDI.loader.stop();

var MIDIPlayerPercentage = function(player) {
        
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
        };
        
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

/*
	composition data setup
*/

var composition = function(){

	var formatType=1;
	var trackCount=1; //단일트랙 파일인 경우만 생각함
	var timeDivision=480; //Ticks per Beat;
	var header = {
		'formatType': formatType,
		'trackCount': trackCount,
		'ticksPerBeat': ticksPerBeat
	}
	var tracks=[];
	tracks[0]=[];

	function noteOn(deltaTime, noteNumber, velocity){
		var event={};
		event.deltaTime=deltaTime;
		event.type='channel';
		event.noteNumber=noteNumber;
		event.velocity=velocity;
		event.subType='noteOn';

		tracks[0].push(event);
	}

	function noteOff(deltaTime, noteNumber){
		var event={};
		event.deltaTime=deltaTime;
		event.type='channel';
		event.noteNumber=noteNumber;

		tracks[0].push(event);
	}

	composition.formatType=1;
	composition.trackCount=1; //단일트랙 파일인 경우만 생각함
	composition.timeDivision=480; //Ticks per Beat;
	composition.header = {
		'formatType': composition.formatType,
		'trackCount': composition.trackCount,
		'ticksPerBeat': composition.ticksPerBeat
	};
	composition.tracks=[];

	composition.noteOn = function(deltaTime, noteNumber, velocity){
		var event={};
		event.deltaTime=deltaTime;
		event.type='channel';
		event.noteNumber=noteNumber;
		event.velocity=velocity;
		event.subType='noteOn';

		composition.tracks[0].push(event);
	};

	composition.noteOff = function(deltaTime, noteNumber){
		var event={};
		event.deltaTime=deltaTime;
		event.type='channel';
		event.noteNumber=noteNumber;

		composition.tracks[0].push(event);
	};

}

function CompositionFile(){
	return {
		'header': composition.header,
		'tracks': composition.tracks
	}
};

//---playlist 데이터 관리---//

var playlist = function(){

	/*
		entry: 한 곡, 즉 하나의 MidiObject에 대응
		list: entry의 리스트
		entryNum: entry의 순서
		numOfEntries: entry 개수
		nowPlaying: 현재 플레이하고있는 곡의 entryNum
	*/

	var list=[];
	var numOfEntries = 0;
	var entryNum = 0;
	var nowPlaying;

	function loadSong(){

		player.loadSong(song,callback);
		//callback may include reloading playlist view etc
	};

	function loadPlaylistOnLogin(){

		//list=

		for(int i=0; i<list.length; i++)
		{
			addToList(list[i]);
		}

	};

	function addToList(midiID){
		var entry={};
		entry.midiID=midiID;
		numOfEntries++;
		entry.entryNum=numOfEntries;
		list.push(entry);
	};

};