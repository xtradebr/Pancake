/**
 * Created by ipark on 2013. 11. 4..
 */

'use strict';

angular.module('pancakeApp')
  .controller('MusicListCtrl', function($scope, $http, listhandler) {

    $scope.show = false;
    $scope.musicName = '';

    var url = '/api/query/musiclist';
    var list = [
      {
        id: 1,
        MidiFileId: 1,
        title: '우린 지금 어디로 가는걸까',
        description: '랄라스윗 노래 같지만 우리 심정임',
        artist: '랄라스윗',
        playtime: 240,
        like: 10,
        comment: 20,
        albumArt: '/images/test01.jpg',
        share: 'http://soundpancake.io/#!/id=1'
      },
      {
        id: 1,
        MidiFileId: 2,
        title: '테스트 데이터',
        description: '힝 속았지?',
        artist: '테스터',
        playtime: 20,
        like: 1,
        comment: 2,
        albumArt: '/images/test01.jpg',
        share: 'http://soundpancake.io/#!/id=2'
      },
      {
        id: 1,
        MidiFileId: 3,
        title: '오픈 쏘오스',
        description: '오픈 쏘스를 빙자한 소스 테러',
        artist: 'VReality64',
        playtime: 193,
        like: 100,
        comment: 20,
        albumArt: '/images/test01.jpg',
        share: 'http://soundpancake.io/#!/id=3'
      },
      {
        id: 1,
        MidiFileId: 4,
        title: '대쉬 보드야~',
        description: '나대쉬보드',
        artist: 'DashBoard',
        playtime: 33,
        like: 10,
        comment: 20,
        albumArt: '/images/test01.jpg',
        share: 'http://soundpancake.io/#!/id=4'
      },
      {
        id: 1,
        MidiFileId: 3,
        title: '??z',
        description: 'ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ',
        artist: '???',
        playtime: 213,
        like: 100,
        comment: 20,
        albumArt: '/images/test01.jpg',
        share: 'http://soundpancake.io/#!/id=3'
      }
    ];
    var dummy = [
      {
        MidiFileId: 1,
        title: '우린 지금 어디로 가는걸까',
        description: '랄라스윗 노래 같지만 우리 심정임',
        artist: '랄라스윗',
        playtime: 240,
        like: 10,
        comment: 20,
        albumArt: '/images/test01.jpg',
        share: 'http://soundpancake.io/#!/id=1',
        MidiObject: 1
      },
      {
        MidiFileId: 2,
        title: '테스트 데이터',
        description: '힝 속았지?',
        artist: '테스터',
        playtime: 20,
        like: 1,
        comment: 2,
        albumArt: '/images/test01.jpg',
        share: 'http://soundpancake.io/#!/id=2',
        MidiObject: 2
      },
      {
        MidiFileId: 3,
        title: '오픈 쏘오스',
        description: '오픈 쏘스를 빙자한 소스 테러',
        artist: 'VReality64',
        playtime: 193,
        like: 100,
        comment: 20,
        albumArt: '/images/test01.jpg',
        share: 'http://soundpancake.io/#!/id=3',
        MidiObject: 3
      },
      {
        MidiFileId: 4,
        title: '대쉬 보드야~',
        description: '나대쉬보드',
        artist: 'DashBoard',
        playtime: 33,
        like: 10,
        comment: 20,
        albumArt: '/images/test01.jpg',
        share: 'http://soundpancake.io/#!/id=4',
        MidiObject: 4
      },
      {
        MidiFileId: 3,
        title: '??z',
        description: 'ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ',
        artist: '???',
        playtime: 213,
        like: 100,
        comment: 20,
        albumArt: '/images/test01.jpg',
        share: 'http://soundpancake.io/#!/id=3',
        MidiObject: 3
      }
    ];
    listhandler.clear();

    listhandler.setItems(list);
    listhandler.setDummy(dummy);
    listhandler.setUrl(url);
    $scope.listhandler = listhandler;

    $scope.$on('showMusicInfo', function(event, music) {
      $scope.show = true;
      $scope.music = music;
    });

    $scope.search = function($event) {
      $event.preventDefault();
      var url = '/api/query/musiclist';
      $http.post(url, {'name': $scope.musicName}, {timeout: 3000})
        .success(function(data, status) {
          console.log("fetching success!");
          $scope.listhandler.clear();
          $scope.listhandler.setItems(data.list);
        })
        .error(function(data, status) {
          console.log("fetching list fails from server.");
        });
    }
  });

angular.module('pancakeApp')
  .directive('musicComponent', function($rootScope, $http, $notification) {

    var url = '/api/query/musiclist';

    function link(scope) {
      scope.onLike = false;

      scope.play = function() {
        console.log("Play!");
//        console.log(scope.music);
        $rootScope.appendtolist(scope.music);
        $notification.info("'" + scope.music.title + "' Added!", 'check music list');
      };

      scope.like = function() {
        console.log("Like!");

        $http.post(url, {'id': scope.music.id, 'like': true}, {timeout: 3000})
          .success(function(data, status) {
            // TODO: 실제로는 서버의 like 수를 response로 받아서 그것을 업데이트 해야한다.
            scope.music.like++;
            $notification.success('Like It!', scope.music.title);
          })
          .error(function(data, status) {
            $notification.error('error occur !', 'try it again few second later...');
          });
      };

      scope.share = function() {
        console.log("Share!");
        $notification.error('Not Available!', 'Share Function is not available now...');
      };

      scope.info = function() {
        scope.$emit('showMusicInfo', scope.music);
      };
    }

    return {
      restrict: 'E',
      link: link,
      templateUrl: '/views/music.html'
    };
  });
