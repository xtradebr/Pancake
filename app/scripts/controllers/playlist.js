/**
 * Created by ipark on 2013. 10. 25..
 */

'use strict';

angular.module('pancakeApp')
  .controller('PlayListCtrl', function($scope, listhandler) {

    // TODO: dummy (empty) data. 실제론 서버에 쿼리를 날림
    $scope.playerName = '';
    $scope.showPublisher = false;

    var list = [
      {
        // id: server에서 참조하는 각 player의 고유 식별 번호
        id: 1,
        name: 'Bruno Mars Player',
        description: 'Bruno Mars 이제 안 듣는뎅...',
        publisher: 'bruno mars lover',
        publisherImage: 'fa fa-apple fa-7x',
        like: 100,
        comment: 20,
        share: 'http://soundpancake.io/player/link/bruno-mars-lover/bruno-mars-player',
        musicList: [
          {
            MidiFileID: 1,
            title: 'Marry You',
            description: 'i wanna marry you',
            artist: 'Bruno Mars',
            playtime: 240,
            like: 10,
            comment: 20,
            albumArt: '/images/test01.jpg',
            share: 'http://soundpancake.io/#!/id=1',
            MidiObject: 1
          },
          {
            MidiFileID: 12,
            title: 'Money Make Her Smile',
            description: 'Money Money Money',
            artist: 'Bruno Mars',
            playtime: 180,
            like: 10,
            comment: 20,
            albumArt: '/images/test01.jpg',
            share: 'http://soundpancake.io/#!/id=12',
            MidiObject: 12
          }
        ]
      },
      {
        id: 2,
        name: 'Dark Knights Player',
        description: 'Movie Dark Knights O.S.T',
        publisher: 'Joker',
        publisherImage: 'fa fa-github-alt fa-7x',
        like: 500,
        comment: 59,
        share: 'http://soundpancake.io/player/link/joker/dark-knights-player',
        musicList: [
          {
            MidiFileID: 21,
            title: 'Why So Serious?',
            description: 'Dark Knights O.S.T',
            artist: 'Hans Zimmer',
            playtime: 554,
            like: 100,
            comment: 200,
            albumArt: '/images/test01.jpg',
            share: 'http://soundpancake.io/#!/id=21',
            MidiObject: 21
          },
          {
            MidiFileID: 22,
            title: 'Like A Dog Chasing Cars',
            description: 'Dark Knights O.S.T',
            artist: 'Hans Zimmer',
            playtime: 303,
            like: 100,
            comment: 200,
            albumArt: '/images/test01.jpg',
            share: 'http://soundpancake.io/#!/id=22',
            MidiObject: 22
          }
        ]
      }
    ];
    var dummy = [
      {
        // id: server에서 참조하는 각 player의 고유 식별 번호
        id: 1,
        name: 'Bruno Mars Player',
        description: 'Bruno Mars 이제 안 듣는뎅...',
        publisher: 'bruno mars lover',
        publisherImage: 'fa fa-apple fa-7x',
        like: 100,
        comment: 20,
        share: 'http://soundpancake.io/player/link/bruno-mars-lover/bruno-mars-player',
        musicList: [
          {
            MidiFileID: 1,
            title: 'Marry You',
            description: 'i wanna marry you',
            artist: 'Bruno Mars',
            playtime: 240,
            like: 10,
            comment: 20,
            albumArt: '/images/test01.jpg',
            share: 'http://soundpancake.io/#!/id=1',
            MidiObject: 1
          },
          {
            MidiFileID: 12,
            title: 'Money Make Her Smile',
            description: 'Money Money Money',
            artist: 'Bruno Mars',
            playtime: 180,
            like: 10,
            comment: 20,
            albumArt: '/images/test01.jpg',
            share: 'http://soundpancake.io/#!/id=12',
            MidiObject: 12
          }
        ]
      },
      {
        id: 2,
        name: 'Dark Knights Player',
        description: 'Movie Dark Knights O.S.T',
        publisher: 'Joker',
        publisherImage: 'fa fa-github-alt fa-7x',
        like: 500,
        comment: 59,
        share: 'http://soundpancake.io/player/link/joker/dark-knights-player',
        musicList: [
          {
            MidiFileID: 21,
            title: 'Why So Serious?',
            description: 'Dark Knights O.S.T',
            artist: 'Hans Zimmer',
            playtime: 554,
            like: 100,
            comment: 200,
            albumArt: '/images/test01.jpg',
            share: 'http://soundpancake.io/#!/id=21',
            MidiObject: 21
          },
          {
            MidiFileID: 22,
            title: 'Like A Dog Chasing Cars',
            description: 'Dark Knights O.S.T',
            artist: 'Hans Zimmer',
            playtime: 303,
            like: 100,
            comment: 200,
            albumArt: '/images/test01.jpg',
            share: 'http://soundpancake.io/#!/id=22',
            MidiObject: 22
          }
        ]
      }
    ];
    listhandler.clear();

    listhandler.setItems(list);
    listhandler.setDummy(dummy);
    $scope.listhandler = listhandler;

    $scope.FilterCtrl = function($scope, $timeout) {

      $scope.moods = [
        { name: '신나는', checked: false },
        { name: '인기있는', checked: false },
        { name: '웅장한', checked: false }
      ];
      $scope.socialAction = [
        { name: '좋아요', checked: false },
        { name: '댓글', checked: false }
      ];
      $scope.moods.hasFilter = function(filter) {
        for(var i=0; i<$scope.moods.length; i++) {
          if($scope.moods[i].name === filter) {
            return true;
          }
        }
        return false;
      };

      $scope.showAlert = false;
      $scope.alerts = [];

      $scope.addMoodFilter = function() {
        if(this.filter) {
          if(this.moods.hasFilter(this.filter)) {
            $scope.showAlert = !$scope.showAlert;

            // show alert if typed filter already exist in moods list
            if( $scope.showAlert && $scope.alerts.length < 1 ) {
              console.log("Alert 추가됨~");
              $scope.alerts.push( { msg: "이미 목록에 존재하는 필터입니다." } );
            }
            // hide alert after 3s
            $timeout(function() {
              $scope.showAlert = !$scope.showAlert;
              $scope.alerts.splice(0, 1);
            }, 3000);
          } else {
            this.moods.push( {name: this.filter, checked: true} );
          }
          this.filter = '';
        }
      };
    };
  });

angular.module('pancakeApp')
  .directive('playerComponent', function() {

    // 부모 scope에 playlists라는 곡 목록을 저장한 후,
    // 해당 리스트의 요소들을 player라는 이름으로 interation 할 때,
    // playerComponent element 사용 가능
    function link(scope) {
      scope.onLike = false;
      scope.onComment = false;
      scope.onSahre = false;
      scope.showList = false;

      scope.play = function() {
        // add music info to inside player
        console.log("Play Fn is called");
      };

      scope.like = function() {
        console.log("press Like It!");
        console.log(scope.player);
      };

      scope.comment = function() {
        console.log("press Comments!");
        console.log(scope.player);
        console.log(scope.onComment);
      };

      scope.share = function() {
        console.log("press Share It!");
        console.log(scope.player);
      };
    }

    return {
      restrict: 'E',
      link: link,
      templateUrl: '/views/player.html',
      priority: 10
    };
  });
