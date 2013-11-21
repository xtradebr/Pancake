/**
 * Created by ipark on 2013. 10. 25..
 */

'use strict';

angular.module('pancakeApp')
  .controller('PlayListCtrl', function($scope, $http, listhandler) {

    // TODO: dummy (empty) data. 실제론 서버에 쿼리를 날림
    $scope.playerName = '';
    $scope.showPublisher = false;

    var url = '/api/query/playlist';
    $scope.list = [
      {
        // id: server에서 참조하는 각 player의 고유 식별 번호
        id: 1,
        name: 'Bruno Mars Player',
        description: 'Bruno Mars 이제 안 듣는뎅...',
        publisher: 'bruno mars lover',
        publisherImage: 'fa fa-apple fa-5x',
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
        publisherImage: 'fa fa-github-alt fa-5x',
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
        publisherImage: 'fa fa-apple fa-5x',
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
        publisherImage: 'fa fa-github-alt fa-5x',
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
    //listhandler.clear();

    listhandler.setItems($scope.list);
    listhandler.setDummy(dummy);
    listhandler.setUrl(url);
    $scope.listhandler = listhandler;

    $scope.search = function($event) {
      $event.preventDefault();

      $http.post(url, {'name': $scope.playerName})
        .success(function(data, status) {
          console.log("fetching success!");
          $scope.listhandler.clear();
          $scope.listhandler.setItems(data.list);
        })
        .error(function(data, status) {
          console.log("fetching list fails from server.");
        });
    };

    $scope.$on('$routeChangeSuccess', function(next, current) {
      listhandler.clear();
      listhandler.setUrl(url);
    });

    $scope.FilterCtrl = function($scope, $http, $notification, loginHandler) {

      var url = 'http://www.soundpancake.io/api/query/playlist';

      $scope.moods = [
        { name: 'Funny', checked: false },
        { name: 'Hot', checked: false },
        { name: 'Peaceful', checked: false }
      ];
      $scope.socialAction = [
        { name: 'Like', checked: false },
        { name: 'Comment', checked: false }
      ];
      $scope.moods.hasFilter = function(filter) {
        for(var i=0; i<$scope.moods.length; i++) {
          if($scope.moods[i].name === filter) {
            return true;
          }
        }
        return false;
      };

      $scope.addMoodFilter = function() {
        if(this.filter) {
          if(this.moods.hasFilter(this.filter)) {
            $notification.error('typed mood is already exists!');
          } else {
            this.moods.push( {name: this.filter, checked: true} );
            $scope.checked();
          }
          this.filter = '';
        }
      };

      $scope.checked = function() {
        var body = {
          mood: []
        };

        $scope.moods.forEach(function(item) {
          if( item.checked ) {
            body.mood.push(item.name);
          }
        });

//        console.log(body);
       // query(body);
      };

      $scope.social = function() {
        var body = {
          userid: loginHandler.getID(),
          action: []
        };
        $scope.socialAction.forEach(function(item) {
          if( item.checked ) {
            body.action.push(item.name);
          }
        });

        query(body);
      };

      function query(body) {
        $http.post(url, body)
          .success(function(data, status) {
            // response data is play list
            listhandler.clear();
            listhandler.setItems(data.list);
            $notification.info('Get List Number is', data.playlist.length);
          })
          .error(function(data, status) {
            $notification.error("Error occurs !", "fail to fetch list from server.");
          });
      }
    };
  });

angular.module('pancakeApp')
  .directive('playerComponent', function($rootScope, $http, $notification) {

    var url = '/api/query/playlist';

    // 부모 scope에 playlists라는 곡 목록을 저장한 후,
    // 해당 리스트의 요소들을 player라는 이름으로 iteration 할 때,
    // playerComponent element 사용 가능
    function link(scope) {
      scope.onLike = false;
      scope.onComment = false;
      scope.onSahre = false;
      scope.showList = false;

      scope.play = function() {
        // add music info to inside player
        console.log("Play Fn is called");
        scope.player.musicList.forEach( function(item) {
          $rootScope.appendtolist(item);
        });
        $notification.info("'" + scope.player.name + "' Added", 'check music list');
      };

      scope.like = function() {
        console.log("press Like It!");

        $http.post(url, { 'id': scope.player.id, 'like': true } )
          .success(function(data, status) {
            // TODO: Music List의 Like와 동일하게 서버쪽의 Like 수와 동기화 필요
            scope.player.like++;
            $notification.success('Like It!', scope.player.name);
          })
          .error(function(data, status) {
            $notification.error('error occur !', 'try it again few second later...');
          });
      };

      scope.comment = function() {
        console.log("press Comments!");
        $notification.error('Not Available!', 'Comment Function is not available now...');

        // TODO: add commenting function.
//        $http.post(url, { 'id': scope.player.id, 'comment': true } )
//          .success(function(data, status) {
//            scope.player.comment++;
//            $notification.info('Comment It!', scope.player.name);
//          })
//          .error(function(data, status) {
//            $notification.error('error occur !', 'try it again few second later...');
//          });
      };

      scope.share = function() {
        console.log("press Share It!");
        $notification.error('Not Available!', 'Share Function is not available now...');
      };

      scope.addMusic = function(item) {
        $rootScope.appendtolist(scope.player.musicList[item]);
        $notification.info("'" + scope.player.musicList[item].title + "' Added", 'check music list');
      };
    }

    return {
      restrict: 'E',
      link: link,
      templateUrl: '/views/player.html',
      priority: 10
    };
  });
