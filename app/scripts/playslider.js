'use strict';

app.controller('PlaySliderCtrl', function($rootScope) {

  var player;
  MIDI.loadPlugin(function(){
	player = MIDI.Player;
  console.log("is this executed?");
  });  
/*
   entry: 한 곡, 즉 하나의 MidiObject에 대응
   list: entry의 리스트
   nowPlaying: 현재 플레이하고있는 곡의 entryNum
   */
  $rootScope.list = [
    {
      'id': 1234,
      'title': 'stronger',
      'artist': 'Britney Spears',
      'owner': undefined,
      'playtime': 300,
      'like': 123,
      'comment': 10,
      'description': 'if you feel weak, check this song out!',
      'albumArt': 'images/stronger.png',
      'MidiFileId': 1234, //obsolete (dummy)
      'share': 'link1',
      'data': {}
    },
    {
      'id': 2345,
      'title': 'mamma mia',
      'artist': 'ABBA',
      'owner': undefined,
      'playtime': 300,
      'like': 234,
      'comment': 20,
      'description': 'if theres mamma mia then is there pappa pia?',
      'albumArt': 'images/mamma mia.png',
      'MidiFileId': 2345,
      'share': 'link2',
      'data': {}
    },
    {
      'id': 34567,
      'title': 'james bond theme',
      'artist': 'somebody idunno',
      'owner': undefined,
      'playtime': 300,
      'like': 345,
      'comment': 30,
      'description': 'a common theme song',
      'albumArt': 'images/james bond.png',
      'MidiFileId': 34567,
      'share': 'link3',
      'data': {}
    }
  ];
  $rootScope.nowPlaying;
  $rootScope.nowSelected = 1;

  $rootScope.appendtolist = function (midiObject) {
    $rootScope.list.push(midiObject);
    $rootScope.reload($rootScope);
  };
  $rootScope.deletefromlist = function (index) {
    $rootScope.list.splice(index,1);
    $rootScope.reload($rootScope);
    $rootScope.moveToPanel(index-1);
  };

  function nowPlayingNext(){
    if ($roorScope.nowPlaying<$rootScope.list.length){
      return $rootScope.nowPlaying+1;
    }
    else{
      return 1;
    }
  }
  function nowPlayingPrev(){
    if ($roorScope.nowPlaying===1){
      return $rootScope.list.length;
    }
    else if ($roorScope.nowPlaying > $rootScope.list.length){
      return $roorScope.nowPlaying;
    }
    else{
      return $roorScope.nowPlaying-1;
    }
  }

  $rootScope.stopbutton = function () {
    MIDI.noteOn(0, 100, 127, 0);
	player.stop();
    console.log("stop button");
    console.log("MIDI defined? "+MIDI);
  };
  $rootScope.playbutton = function () {
    MIDI.noteOn(0, 100, 127, 0);
	if (player.playing){
      player.start();
      console.log(player.start);
    }
    else{
      player.resume();
    }
	console.log("play button");
  };
  $rootScope.pausebutton = function () {
    player.pause();
	console.log("pause button");
  };
  $rootScope.nextbutton = function () {
    $roorScope.nowPlaying = nowPlayingNext();
    loadSong(list[nowPlaying]);
	console.log("next button");
  };
  $rootScope.prevbutton = function () {
    $roorScope.nowPlaying = nowPlayingPrev();
    loadSong(list[nowPlaying]);
	console.log("prev button");
  };

  var ifOpen = false;
  $rootScope.openlist = function () {
    if(ifOpen){
      $('body').css('margin-bottom',25);
      $('footer').css('height',25);
      ifOpen=false;
    }
    else{
      $('body').css('margin-bottom',175);
      $('footer').css('height',175);
      ifOpen=true;
    }
  };

  function loadSong (midiObject) {
    //console.log('load song wth midifileid:'+MidiFileId);    
    //unnecessary due to change of structure which brought in MidiFile data into MidiObject
    /*uploadSocket.emit('requestMidiFile',MidiFileId);
    uploadSocket.on('sendMidiFile',function(midiFileObject){
      player.loadMdiFileObject(midiFileObject);
    });*/
   // MIDI.loadPlugin(function(){
	player.loadMidiFileObject(midiObject.data);
	MIDIPlayerPercentage(player);
   // });
	player.start();
    console.log("midiObject.data should be a MidiFile instance");
    console.dir(midiObject.data);
    console.log("player looks like this");
    console.dir(player);
  }


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
	console.log("reached now===end");
	player.start();
	//nextbutton();
        //player.loadFile(song, player.start); // load MIDI
      }
      // display the information to the user
      timeCursor.style.width = (percent * 100) + "%";
      playtime.innerHTML = timeFormatting(now);
      endtime.innerHTML = timeFormatting(end);
    })
  };

  //init function
  $(function ($rootScope){
    $('#scroll').css('left', 390 - 100 * ($rootScope.nowSelected));
    $('#scroll').css('width', 120 * ($rootScope.list.length));
  }($rootScope));

  $rootScope.reload = function ($rootScope) {
    $('#scroll').css('width', 120 * ($rootScope.list.length));
  };

  $rootScope.moveToPanel = function (panelNum) {

      //play if same panel is clicked again
      if(panelNum ===($rootScope.nowSelected)){
	console.log("the panel to print has" + $rootScope.list[panelNum]); 
        console.dir($rootScope.list[panelNum]);
	loadSong($rootScope.list[panelNum]);
        $rootScope.playSelect(panelNum);
        return;
      }
      if (panelNum < 0){
        panelNum = 0;
      }
      //gets the old enlarged panel and make it normal
      $('#scroll').find('.enlarged').removeClass('enlarged').find('img').css({'width': 80, 'height': 80, 'margin-top': 10});
      //gets the new panel to enlarge and do the operation
      $('#scroll').find('.panel:eq('+panelNum+')').addClass('enlarged').find('img').css({'width': 100, 'height': 100, 'margin-top': 0});
      //set the nowSelected to the selected panel number
      $rootScope.nowSelected = panelNum;
      //scroll the scroll
      $('#scroll').css('left', 390 - 100 * panelNum); 
  };

  $rootScope.playSelect = function (panelNum) {
      //gets the old playing panel and make it normal
      $('#scroll').find('.playing').removeClass('playing').find('img').css({'border-style': 'none'});
      //gets the new panel to enlarge and do the operation
      $('#scroll').find('.panel:eq('+panelNum+')').addClass('playing').find('img').css({'border-style': 'dotted', 'border-width': 2, 'border-color': 'black'});
      //set the nowSelected to the selected panel number
  };

});

app.directive('ngRightClick', function($parse) {
    return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
    };
});
