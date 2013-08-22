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
    var colorSet = new ColorSet(d3.scale.category10());
    var editor;

    return {
      restrict: 'E',
      // 초기화, 템플릿안에 ng-repeat이 없다면 한번만 실행됨.
      link: function(scope, element, attr) {

        editor = findEditor();
        setEventListenersOf(editor);

        function findEditor() {
          return d3.select("svg");
        }

        function setEventListenersOf(editor) {
          editor.on("click", fill)
                .on("mousemove", particle);
        }

      }
    };

    function draw(circle) {
      circle.transition()
        .duration(1500)
        .ease(Math.sqrt)
        .attr("r", getRandomInt(20, 40))
        .style("stroke-opacity", 1e-6)
        .remove();
    }

    function fill() {
      var circle = makePreDefinedCircle(d3.mouse(this));
      circle.style("fill", colorSet.getColor());
      draw(circle);
    }

    function particle() {
      var circle = makePreDefinedCircle(d3.mouse(this));
      circle.style("fill", "none");
      draw(circle);
    }

    function makePreDefinedCircle(mousePosition) {
      var circle = editor.append("svg:circle");

      circle.attr("cx", mousePosition[0])
        .attr("cy", mousePosition[1])
        .attr("r", 1e-6 + getRandomInt(0,10))
        .style("stroke", colorSet.getColor())
        .style("stroke-opacity", 1);

      return circle;
    }

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

  });


function ColorSet(set) {
  var currentColor = 0;
  this.colors = set;
  this.getColor = function() {
    return this.colors(currentColor);
  };

  this.nextColor = function() {
    ++currentColor;
    return this.getColor();
  }

}