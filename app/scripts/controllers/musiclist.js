/**
 * Created by ipark on 2013. 11. 4..
 */

'use strict';

angular.module('pancakeApp')
  .controller('MusicListCtrl', function($scope, listhandler) {

    $scope.show = false;

    var list = [
      {
        MidiFileID: 1,
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
        MidiFileID: 2,
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
        MidiFileID: 3,
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
        MidiFileID: 4,
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
        MidiFileID: 3,
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
    var dummy = [
      {
        MidiFileID: 1,
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
        MidiFileID: 2,
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
        MidiFileID: 3,
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
        MidiFileID: 4,
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
        MidiFileID: 3,
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

    $scope.listhandler = listhandler;
    $scope.listhandler.setItems(list);
    listhandler.setDummy(dummy);

    $scope.$on('showMusicInfo', function(event, music) {
      $scope.show = true;
      $scope.music = music;
    });
  });

angular.module('pancakeApp')
  .directive('musicComponent', function() {

    function link(scope) {
      scope.onLike = false;

      scope.play = function() {
        console.log("Play!");
        console.log(scope.music);
      };

      scope.like = function() {
        console.log("Like!");
        console.log(scope.music);
      };

      scope.share = function() {
        console.log("Share!");
        console.log(scope.music);
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