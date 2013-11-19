/**
 * Created by ipark on 2013. 11. 4..
 */

'use strict';

angular.module('pancakeApp')
  .controller('MusicListCtrl', function($scope, $http, listhandler) {

    $scope.show = false;
    $scope.musicName = '';

    var url = '/api/query/musiclist';
    $scope.listhandler = listhandler;

    $scope.$on('showMusicInfo', function(event, music) {
      $scope.show = true;
      $scope.music = music;
    });

    $scope.search = function($event) {
      $event.preventDefault();
      var param = {name: $scope.musicName};

      console.log("query to " + url + "/" + JSON.stringify(param));
      $http.post(url, param)
        .success(function(data, status) {
          console.log("fetching success!");
          console.log(data.list);
          $scope.listhandler.clear();
          $scope.listhandler.setItems(data.list);
          $scope.listhandler.setParam(param);
          console.log(data);
        })
        .error(function(data, status) {
          console.log("fetching list fails from server.");
        });
    };

    $scope.$on('$routeChangeSuccess', function(next, current) {
      listhandler.clear();
      listhandler.setUrl(url);
    });
  });

angular.module('pancakeApp')
  .directive('musicComponent', function($rootScope, $http, $notification, loginHandler) {

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

        uploadSocket.emit("like", scope.music.id);
        uploadSocket.on("liked", function(like) {
          scope.music.like = like;
          $notification.success('Like It!', scope.music.title);
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
