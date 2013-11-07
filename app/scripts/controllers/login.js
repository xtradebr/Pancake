/**
 * Created by ipark on 2013. 11. 8..
 */

angular.module('pancakeApp')
  .controller('LoginCtrl', function($scope, $FB, $log) {

    $scope.login = function() {
      $log.info("Try Login!");

      $FB.login( function(res) {
        $log.info("Get Response in Try Login!");
        if(res.authResponse) {
          updateLoginStatus(updateApiMe);
        }
      });
    };

    $scope.logout = function () {
      $FB.logout(function () {
        updateLoginStatus(updateApiMe);
      });
    };

//    var autoToJSON = ['loginStatus', 'apiMe'];
//    angular.forEach(autoToJSON, function (varName) {
//      $scope.$watch(varName, function (val) {
//        $scope[varName + 'JSON'] = JSON.stringify(val, null, 2);
//      }, true);
//    });

    function updateLoginStatus (more) {
      $FB.getLoginStatus(function (res) {
        $scope.loginStatus = res;

        (more || angular.noop)();

        $log.info("In Update Login Status!");
        $log.info(JSON.stringify(res));
      });
    }

    function updateApiMe () {
      $FB.api('/me', function (res) {
        $scope.apiMe = res;

        $log.info("In Api ME!");
        $log.info(JSON.stringify(res));
      });
    }
  });