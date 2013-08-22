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

    $scope.startComposition = function() {
      $scope.editor.startComposition();
    };

    $scope.endComposition = function() {
      $scope.editor.endComposition();
    };

  })
  .directive('editorVisualization', function() {

    // constants
    var editor;

    return {
      restrict: 'E',
      // 초기화, 템플릿안에 ng-repeat이 없다면 한번만 실행됨.
      link: function(scope, element, attr) {
        editor = initEditor();
        scope.editor = editor;
      }
    };

    function initEditor() {
      return new PanelEditor( d3.select("svg") );
    }

  });

function PanelEditor(svg) {
  this.svg = svg;
  svg.on("mousedown", down)
     .on("mouseup", up)
     .on("mousemove", move);

  this.formatter = new MIDIFormatter();

  var colorSet = new ColorSet(d3.scale.category10());
  var circleColorStyle = "none";

  function down() {
    circleColorStyle = colorSet.getColor();
    drawParticle(d3.mouse(this));
  }

  function up() {
    colorSet.nextColor();
    circleColorStyle = "none";
    drawParticle(d3.mouse(this));
  }

  function move() {
    drawParticle(d3.mouse(this));
  }

  function drawParticle(mousePosition) {

    svg.append("svg:circle")
        .attr("cx", mousePosition[0])
        .attr("cy", mousePosition[1])
        .attr("r", d3.random.normal(15, 4))
        .style("stroke", colorSet.getColor())
        .style("stroke-opacity", 1)
        .style("fill", circleColorStyle)
        .transition()
        .duration(1500)
//        .ease(Math.sqrt)
        .style("stroke-opacity", 1e-6)
        .style("fill-opacity", 1e-6)
        .remove();
  }

  this.startComposition = function() {
    var event = { type: 'mockOn', note: 'c#', timestamp: '134646', velocity: '0.5' };
    alert("작곡을 시작함돠~\n");
    this.formatter.createMIDI("Demo");
    this.formatter.sendEvent(event);
  };

  this.endComposition = function() {
    var event = { type: 'mockOff', note: 'c#', timestamp: '134646', velocity: '0.5' };
    alert("작곡을 끝냄돠~\n");
    this.formatter.saveMIDI();
    this.formatter.sendEvent(event);
  }
}

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

function MIDIFormatter() {
  // mock-up
  this.sendEvent = function(event) {};
  this.createMIDI = function(MIDI_Information) {};
  this.saveMIDI = function() {};
}