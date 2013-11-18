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
