/**
 * Created by ipark on 2013. 11. 8..
 */

angular.module('pancakeApp')
  .controller('LoginCtrl', function($scope, $FB, $log, $rootScope, loginHandler) {

    $scope.login = function() {
      loginHandler.login();
      $rootScope.isLogged = true;
    };
  });