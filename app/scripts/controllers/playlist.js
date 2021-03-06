/**
 * Created by ipark on 2013. 10. 25..
 */

'use strict';

angular.module('pancakeApp')
  .controller('PlayListCtrl', function($scope) {

    // TODO: dummy (empty) data. 실제론 서버에 쿼리를 날림
    $scope.playerName = '';
    $scope.showPublisher = false;

    $scope.playerlists = [
      {
        // id: server에서 참조하는 각 player의 고유 식별 번호
        id: 1,
        name: 'Bruno Mars Player',
        description: 'Bruno Mars 이제 안 듣는뎅...',
        publisher: 'bruno mars lover',
        publisherImage: 'fa fa-apple fa-7x',
        likes: 100,
        comments: 20,
        shareLink: 'http://soundpancake.io/player/link/bruno-mars-lover/bruno-mars-player',
        musicList: [
          { name: 'Marry You', time: 240, album: 'Doo-Wops & Hooligans' },
          { name: 'Money Make Her Smile', time: 180, album: 'Unorthodox Jukebox' }
        ]
      },
      {
        id: 2,
        name: 'Dark Knights Player',
        description: 'Movie Dark Knights O.S.T',
        publisher: 'Joker',
        publisherImage: 'fa fa-github-alt fa-7x',
        likes: 500,
        comments: 59,
        shareLink: 'http://soundpancake.io/player/link/joker/dark-knights-player',
        musicList: [
          { name: 'Why So Serious?', time: 554, album: 'Dark Knights O.S.T' },
          { name: 'Like A Dog Chasing Cars', time: 303, album: 'Dark Knights O.S.T' }
        ]
      }
    ];

    $scope.FilterCtrl = function($scope, $timeout) {

      $scope.moods = [
        { name: '신나는', checked: false },
        { name: '인기있는', checked: false },
        { name: '웅장한', checked: false }
      ];
      $scope.socialAction = [
        { name: '좋아요', checked: false },
        { name: '댓글', checked: false },
        { name: '공유', checked: false },
        { name: '작곡', checked: false }
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
      scope.onComments = false;
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
      };

      scope.share = function() {
        console.log("press Share It!");
        console.log(scope.player);
      };
    }

    return {
      restrict: 'E',
      link: link,
      templateUrl: '/views/player.html'
    };
  });
