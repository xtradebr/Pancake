'use strict';

angular.module('pancakeApp')
  .controller('ShareCtrl', function($scope, $rootScope, $http, $routeParams) {
	console.log("Shareing Ctrl");

    $http.post('/api/query/share', {id: $routeParams.id})
      .success(function(data, status) {
	console.log("success share querying");
	$scope.music = data.list[0];
	$rootScope.appendtolist($scope.music);
      })
      .error(function(data, status) {
	console.log("error occurs when getting music data");
      });
  });
