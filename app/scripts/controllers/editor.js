/**
 * Created with JetBrains WebStorm.
 * User: ipark
 * Date: 13. 8. 16.
 * Time: 오후 5:53
 * To change this template use File | Settings | File Templates.
 */
'use strict';

angular.module('pancakeApp')
  .controller('EditorCtrl', function($scope, sharedProperties) {

    $scope.score = sharedProperties.getProperty().score;

  })
  .directive('editorVisualization', function() {

    // constants
    var w = 640;
    var h = 480;
    var m = 30;
    var z = d3.scale.category20c();
    var i = 0;
    var editor;

    return {
      restrict: 'E',
      // attributes bound to the scope
      scope: {},
      // 초기화, 템플릿안에 ng-repeat이 없다면 한번만 실행됨.
      link: function(scope, element, attr) {

        // set-up initial svg object in document
        editor = d3.select(element[0])
          .append("svg:svg")
          .attr("width", w)
          .attr("height", h + m)
          .style("pointer-events", "all")
          .on("mousemove", particle);

        function particle() {
          var m = d3.mouse(this);

          editor.append("svg:circle")
            .attr("cx", m[0])
            .attr("cy", m[1])
            .attr("r", 1e-6)
            .style("stroke", z(++i))
            .style("stroke-opacity", 1)
            .transition()
            .duration(2000)
            .ease(Math.sqrt)
            .attr("r", 100)
            .style("stroke-opacity", 1e-6)
            .remove();
        }
      }
    };


  });