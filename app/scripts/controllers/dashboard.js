/**
 * Created by ipark on 2013. 11. 9..
 */

angular.module('pancakeApp')
  .controller('DashboardCtrl', function($scope, $http, listhandler, $notification, loginHandler) {
    $scope.showMusic = true;
    $scope.name = loginHandler.getName();

    $scope.musiclist = [
      {
        id: 1,
        MidiFileID: 1,
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
        MidiFileID: 2,
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
        MidiFileID: 3,
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
        MidiFileID: 4,
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
        MidiFileID: 3,
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
    $scope.playlist = [
      {
        // id: server에서 참조하는 각 player의 고유 식별 번호
        id: 1,
        name: 'Bruno Mars Player',
        description: 'Bruno Mars 이제 안 듣는뎅...',
        publisher: 'Seong-hyeon Park',
        publisherImage: 'fa fa-smile-o fa-7x',
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
        publisher: 'Seong-hyeon Park',
        publisherImage: 'fa fa-smile-o fa-7x',
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

    initListHandler();

    // TODO: needs to composition with server side
    (function getLists() {

      $http.post('/api/query/musiclist', {'userid': loginHandler.getID(), page:1})
        .success(function(data, status) {
          $scope.musiclist = data.list;
//          console.log(data);
          $scope.listhandler.clear();
          $scope.listhandler.setItems(data.list);
          $scope.listhandler.setUrl('/api/query/musiclist');
        })
        .error(function(data, status) {
          $notification.error("Error occurs !", "fail to fetch list from server.");
        });

      $http.post('/api/query/playlist', {'userid': loginHandler.getID(), page:1})
        .success(function(data, status) {
          $scope.playlist = data.list;
//          console.log(data);
          $scope.listhandler.clear();
          $scope.listhandler.setItems(data.list);
          $scope.listhandler.setUrl('/api/query/playlist');
        })
        .error(function(data, status) {
          $notification.error("Error occurs !", "fail to fetch list from server.");
        });
//    });
    })( );

    $scope.change = function() {
      $scope.showMusic = !$scope.showMusic;
      initListHandler();
    };

    function initListHandler() {
      listhandler.clear();
      $scope.listhandler = listhandler;
      if($scope.showMusic) {
        $scope.listhandler.setItems($scope.musiclist);
        $scope.listhandler.setUrl(getURL());
      } else {
        $scope.listhandler.setItems($scope.playlist);
        $scope.listhandler.setUrl(getURL());
      }
    }

    function getURL() {
      if($scope.showMusic) {
        return '/api/query/musiclist';
      } else {
        return '/api/query/playlist';
      }
    }
  });
