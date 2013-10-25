'use strict';

angular.module('pancakeApp')
  .controller('MainCtrl', function ($scope) {

    $scope.title = 'Sound Pancake';
    $scope.description = 'Sound Pancake이란 서비스임. 막 주저리 주저리 써놓고 싶지만, 구현된게 아직 없어서 ㅎㅎㅎㅎㅎㅎㅎ';
    $scope.keywordList = [
      {icon: 'fa fa-bullhorn fa-3x', name: '재미짐', description: '인터랙티브함 ㅎㅎㅎ'},
      {icon: 'fa fa-coffee fa-3x', name: '조촐함', description: '암것도 없음 ㅎㅎㅎ'},
      {icon: 'fa fa-headphones fa-3x', name: '쉬움', description: '마우스 클릭만 하면 됨 ㅎㅎㅎ'}
    ];

    $scope.DemoCtrl = function ($location, sharedProperties) {

      $scope.start = function () {
        sharedProperties.setProperty(
          { score: { title: 'Demo', beat: '4/4', bpm: '보통' }
        });
        $location.path('/editor');
      };
    };
  });
