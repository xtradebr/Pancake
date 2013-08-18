/**
 * Created with JetBrains WebStorm.
 * User: ipark
 * Date: 13. 8. 16.
 * Time: 오후 5:53
 * To change this template use File | Settings | File Templates.
 */
'use strict';

angular.module('pancakeApp')
  .controller('EditorCtrl', function ($scope, sharedProperties) {

    $scope.score = sharedProperties.getProperty().score;

  });