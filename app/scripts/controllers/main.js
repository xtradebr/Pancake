'use strict';

angular.module('pancakeApp')
  .controller('MainCtrl', function ($scope) {
	console.log("Main Ctrl");

    $scope.title = 'Sound Pancake';
    $scope.description = 'Sound Pancake는 새로운 MIDI 사운드 공유 서비스입니다. 클라우드 컴퓨팅 기술을 활용하여 언제 어디서나 누구나 쉽게 MIDI 음악을 작곡하고 공유할 수 있습니다. 이제 새로운 클라우드 서비스를 즐겨보세요~';
    $scope.keywordList = [
      {image: './../../images/Watches.png', alt: 'fa fa-bullhorn fa-3x', name: '재미짐', description: '정말로 쉽고 재미있는 MIDI 작곡'},
      {image: './../../images/Chat.png', alt: 'fa fa-coffee fa-3x', name: '쉬움', description: '쉽고 빠른 MIDI 공유'},
      {image: './../../images/Infinity-Loop.png', alt: 'fa fa-headphones fa-3x', name: '감상', description: '무한 MIDI 플레이~'}
    ];

    $scope.DemoCtrl = function ($location) {

      $scope.start = function () {
        $location.path('/editor');
      };
    };
  });
