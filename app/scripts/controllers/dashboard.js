/**
 * Created by ipark on 2013. 11. 9..
 */

angular.module('pancakeApp')
  .controller('DashboardCtrl', function($scope, $http, listhandler, $notification, loginHandler) {
    $scope.showMusic = true;
    $scope.name = loginHandler.getName();
    if(loginHandler.getUID() != "guest") {
      $scope.picture = "<img alt=\"fb image\" src=\"http://graph.facebook.com/" + loginHandler.getUID() + "/picture?type=normal\" />";
    } else {
      $scope.picture = "<i class=\"fa fa-smile-o fa-4x\"></i>";
    }

    $scope.musiclist = [];
    $scope.playlist = [];

    initListHandler();

    $scope.change = function() {
      $scope.showMusic = !$scope.showMusic;
      initListHandler();
	console.log($scope.musiclist.length);
    };

    function initListHandler() {
      listhandler.clear();
      $scope.listhandler = listhandler;
      if($scope.showMusic) {
        $scope.listhandler.setItems($scope.musiclist);
        $scope.listhandler.setUrl(getURL());
        $scope.listhandler.setParam({userid: loginHandler.getID(), page: 1});
	console.log(loginHandler.getID());
      } else {
        $scope.listhandler.setItems($scope.playlist);
        $scope.listhandler.setUrl(getURL());
        $scope.listhandler.setParam({userid: loginHandler.getID(), page: 1});
      }
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
