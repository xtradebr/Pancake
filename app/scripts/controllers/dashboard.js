/**
 * Created by ipark on 2013. 11. 9..
 */

angular.module('pancakeApp')
  .controller('DashboardCtrl', function($scope, $http, listhandler, $notification, loginHandler) {
    $scope.showMusic = true;
    $scope.name = loginHandler.getName();
    $scope.length = {
      musiclist: 5,
      playlist: 0
    };

    if(loginHandler.getUID() != "guest") {
      $scope.picture = "<img alt=\"fb image\" src=\"http://graph.facebook.com/" + loginHandler.getUID() + "/picture?type=normal\" />";
    } else {
      $scope.picture = "<i class=\"fa fa-smile-o fa-4x\"></i>";
    }

    initListHandler();

    // TODO: get length of musiclist and playlist of user
    // has to be through new query

    $scope.change = function() {
      $scope.showMusic = !$scope.showMusic;
      initListHandler();
    };

    function initListHandler() {
      listhandler.clear();
      $scope.listhandler = listhandler;
      $scope.listhandler.setUrl(getURL());
      $scope.listhandler.setParam({userid: loginHandler.getName(), page: 1});

      listhandler.nextPage();
    }

    function getURL() {
      if($scope.showMusic) {
        return '/api/query/musiclist';
      } else {
        return '/api/query/playlist';
      }
    }
  });
