'use strict';

angular.module('pancakeApp')
  .controller('MainCtrl', function ($scope) {

    //TODO: home에서 처리할 모든 작업들 컨트롤러로 만들어서 주입...

    $scope.CreateScoreCtrl = function ($scope, $location, sharedProperties) {

      $scope.beat_list = ['3/4', '4/4', '6/8'];
      $scope.bpm_list = ['느림', '보통', '빠름'];

      $scope.score = { title: '', beat: $scope.beat_list[1], bpm: $scope.bpm_list[1] };

      $scope.create = function () {
        $scope.shouldBeOpen = true;
      };

      $scope.ok = function () {
        //TODO: validate user input data
        sharedProperties.setProperty({ score: $scope.score });
        $location.path('/editor');
        $scope.shouldBeOpen = false;
      };

      $scope.close = function () {
        $scope.shouldBeOpen = false;
        clearScore();
      };

      var clearScore = function () {
        $scope.score = { title: '', beat: $scope.beat_list[1], bpm: $scope.bpm_list[1] };
      };

      $scope.opts = {
        backdropFade: true,
        dialogFade:true
      };
    };

    $scope.DemoCtrl = function ($location, sharedProperties) {

      $scope.start = function () {
        sharedProperties.setProperty(
          { score: { title: 'Demo', beat: '4/4', bpm: '보통' }
        });
        $location.path('/editor');
      }
    }
  });
