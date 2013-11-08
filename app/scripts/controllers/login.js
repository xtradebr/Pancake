/**
 * Created by ipark on 2013. 11. 8..
 */

angular.module('pancakeApp')
  .controller('LoginCtrl', function($scope, $modalInstance, loginHandler) {

    $scope.login = function() {
      loginHandler.login();
      $modalInstance.close();
    };

    $scope.cancel = function() {
      $modalInstance.dismiss();
    };

  });