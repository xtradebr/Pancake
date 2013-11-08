'use strict';

var app = angular.module('pancakeApp', ['ui.bootstrap']);

app.config(function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(false).hashPrefix('!');

  $routeProvider
    .when('/home', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl',
      title: 'Home',
      isInEditor: false
    })
    .when('/editor', {
      templateUrl: 'views/editor.html',
      controller: 'EditorCtrl',
      title: 'Editor',
      isInEditor: true
    })
    .when('/musiclist', {
      templateUrl: 'views/musiclist.html',
      controller: 'MusicListCtrl',
      title: 'Music List',
      isInEditor: false
    })
    .when('/playlist', {
      templateUrl: 'views/playlist.html',
      controller: 'PlayListCtrl',
      title: 'Play List',
      isInEditor: false
    })
    .when('/about', {
      templateUrl: 'views/about.html',
      controller: 'AboutCtrl',
      title: 'About',
      isInEditor: false
    })
    .otherwise({
      redirectTo: '/home'
    });
});

app.run(function ($rootScope) {
  $rootScope.$on('$routeChangeSuccess', function(event, currentRoute) {
    $rootScope.title = currentRoute.title;
    $rootScope.isInEditor = currentRoute.isInEditor;

  });
});

app.controller('ImageSliderCtrl', function($rootScope) {


      var player;
      MIDI.loadPlugin(function(){
        player = MIDI.Player;
      })
      /*
          entry: 한 곡, 즉 하나의 MidiObject에 대응
          list: entry의 리스트
          numOfEntries: entry 개수
          nowPlaying: 현재 플레이하고있는 곡의 entryNum
      */
      $rootScope.list= [
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
                 'MidiFileId': 1234,
                 'share': 'link1'
              },
              {
                 'id': 2345,
                 'title': 'mamma mia',
                 'artist': 'ABBA',
                 'owner': undefined,
                 'playtime': 300,
                 'likes': 234,
                 'comment': 20,
                 'description': 'if theres mamma mia then is there pappa pia?',
                 'albumArt': 'images/mamma mia.png',
                 'MidiFileId': 2345,
                 'share': 'link2'
              },
              {
                 'id': 34567,
                 'title': 'james bond theme',
                 'artist': 'somebody idunno',
                 'owner': undefined,
                 'playtime': 300,
                 'likes': 345,
                 'comment': 30,
                 'description': 'a common theme song',
                 'albumArt': 'images/james bond.png',
                 'MidiFileId': 34567,
                 'share': 'link3'
              }
      ];
      var numOfEntries = 3;
      var nowPlaying = 1;

      $rootScope.appendtolist = function (midiObject) {
          list.push(midiObject);
      }
      $rootScope.deletefromlist = function (index) {
          list.splice(index,1);
      }


      function nowPlayingNext(){
        if (nowPlaying<numOfEntries){
          return nowPlaying+1;
        }
        else{
          return 1;
        }
      }
      function nowPlayingPrev(){
        if (nowPlaying===1){
          return numOfEntries;
        }
        else if (nowPlaying>numOfEntries){
          return nowPlaying;
        }
        else{
          return nowPlaying-1;
        }
      }

      $rootScope.stopbutton = function () {
        player.stop();
      }
      $rootScope.playbutton = function () {
        if (player.playing){
          player.start();
        }
        else{
          player.resume();
        }
      }
      $rootScope.pausebutton = function () {
        player.pause();
      }
      $rootScope.nextbutton = function () {
        nowPlaying = nowPlayingNext();
        //midiObject=list[nowPlaying];
        //loadSong(midiObject.MidiFileId);
        $('#slider-one').data('movingBoxes').currentPanel(nowPlaying);
      }
      $rootScope.prevbutton = function () {
        nowPlaying = nowPlayingPrev();
        //midiObject=list[nowPlaying];
        //loadSong(midiObject.MidiFileId);
        $('#slider-one').data('movingBoxes').currentPanel(nowPlaying);
      }

      var ifOpen = false;    
      $rootScope.openlist = function () {
        if(ifOpen){
          $('body').css('margin-bottom',25);
          $('footer').css('height',25);
          ifOpen=false;
        }
        else{
          $('body').css('margin-bottom',165);
          $('footer').css('height',165);
          ifOpen=true;
        }
      }

      function loadSong(MidiFileId) {

        //TODO:get corresponding midiObject from server
        
        player.loadMidiFileObject(midiFileObject);    
      }


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
        })
}
});

