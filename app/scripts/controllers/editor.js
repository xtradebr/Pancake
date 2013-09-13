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

// TODO: Separation of Concerns은 자바스크립트에 대해 좀 더 이해한 후에 진행.
function PanelEditor(svg) {
  var stats = new Stats();
  stats.setMode(0); // 0: fps, 1: ms

  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = xPos + 'px';
  stats.domElement.style.top = svgHeight + 'px';

  document.body.appendChild( stats.domElement );

  svg.on("mousedown", down)
     .on("mouseup", up)
     .on("mousemove", move);

  var formatter = new MIDIFormatter();

  var colorSet = new ColorSet(d3.scale.category10());
  var circleColorStyle = "none";
  var circleRadius = d3.random.normal(10, 2);
  var pointerCircle;

  // TODO: need to re-calculate event when window size changed
  var svgWidth = parseInt(svg.style("width"));
  var svgHeight = parseInt(svg.style("height"));
  var xPos = svgWidth/2;
  var sectionCount = 10, pitchCount = 10;
  var volumeRangeList = getVolumeRangeList();
  var circleSizeList = getCircleSizeList();
  var pitchRangeList = getPitchRagneList();

  var mousePosition = [xPos, svgHeight/2];

  // static images
  this.drawBackground = function() {
    var length = pitchCount-1;

    svg.append("svg:line")
      .attr("x1", xPos)
      .attr("y1", 0)
      .attr("x2", xPos)
      .attr("y2", svgHeight)
      .style("stroke", "rgb(180,180,180)")
      .style("stroke-width", 3)
      .classed("standard_line", "standard_line");

    pointerCircle = svg.append("svg:circle")
      .attr("cx", xPos)
      .attr("cy", getLocationInSVG(mousePosition[1]))
      .attr("r", 25)
      .attr("stroke", colorSet.getColor())
      .style("stroke-opacity", 1)
      .style("fill", "none");

    for(var i=0; i<length; i++) {
      svg.append("svg:line")
          .attr("x1", 0)
          .attr("y1", pitchRangeList[i])
          .attr("x2", svgWidth)
          .attr("y2", pitchRangeList[i])
          .style("stroke", "rgb(125,125,125)");
    }
  };

  // dynamic images (animation)
  this.startAnimation = function() {
    var time = 0, tick = 0, frame = 2,
        bar_tick = 0, bar_frame = frame*4;

    function animation() {
      setInterval( function() {
        stats.begin();
        if( ++tick > frame ) {
          tick = 0;
          drawCircle("2000");

          if( ++bar_tick > bar_frame ) {
            bar_tick = 0;
            drawBeatBar("4000");
          }
        }
        stats.end();
      }, 1000 / 60);
    }
    animation();

    function flowAnimation() {
      stats.begin();
      if( ++tick > frame ) {
        tick = 0;
        drawCircle("2000");

        if( ++bar_tick > bar_frame ) {
          bar_tick = 0;
          drawBeatBar("4000");
        }

        return isEndAnimation();
      }
      stats.end();
      return false;
    }

    function isEndAnimation() {
      return (++time > 100000000);
    }

  };

  this.drawBackground();
  this.startAnimation();

  var BeatBarPool = function() {
    var pool = [];
    for(var i=0; i<10; i++) {
      pool[i] =
        svg.append("svg:line")
          .attr("x1", svgWidth)
          .attr("y1", 0)
          .attr("x2", svgWidth)
          .attr("y2", svgHeight)
          .style("stroke", "rgb(125, 125, 125)")
          .style("stroke-width", 1)
      ;
    }

    var idx = 0, length = pool.length;

    return {
      getBeatBar: function() {
        return pool[(idx++)%length];
      }
    }
  }( );

  var CirclePool = function() {
    var pool = [];
    for(var i=0; i<30; i++) {
      pool[i] =
        svg.append("svg:circle")
          .attr("r", 10)
          .style("stroke", colorSet.getColor())
          .style("stroke-width", 2)
      ;
    }

    var idx = 0, length = pool.length;

    return {
      getCircle: function() {
        return pool[(idx++)%length];
      }
    }
  }( );

  function down() {
    circleColorStyle = colorSet.getColor();
  }

  function up() {
//    colorSet.nextColor();
    circleColorStyle = "none";
  }

  function move() {
    mousePosition = d3.mouse(this);
    circleRadius = getRadiusBaseOnXPos(mousePosition[0]);
    pointerCircle.attr("cy", mousePosition[1]);
  }

  function drawCircle(speed) {
    CirclePool.getCircle()
      .attr("cx", xPos)
      .attr("cy", getLocationInSVG(mousePosition[1]))
      .attr("r", circleRadius)
      .style("fill", circleColorStyle)
      .transition()
      .attr("cx", -30)
      .duration(speed)
      .ease("linear");
  }

  function drawBeatBar(speed) {

    BeatBarPool.getBeatBar()
      .transition()
      .attr("x1", -60)
      .attr("x2", -60)
      .duration(speed)
      .ease("linear")
      .each("end", function() {
        d3.select(this)
          .attr("x1", svgWidth)
          .attr("x2", svgWidth);
      });
  }

  function getVolumeRangeList() {
    return getListFrom( 0, parseInt(svgWidth/sectionCount), sectionCount );
  }

  function getPitchRagneList() {
    return getListFrom( 0, parseInt(svgHeight/pitchCount), pitchCount );
  }

  function getCircleSizeList() {
    return getListFrom( 3, (23-7)/sectionCount, sectionCount );
  }

  function getListFrom(min, eachValue, count) {
    min = typeof min !== 'undefined' ? min : 0;

    var list = [];
    for(var i=0; i<count; i++) {
      list[i] = parseInt(min + eachValue*(i+1));
//      printD("list["+i+"] is " + list[i]);
    }
    return list;
  }

  function getRadiusBaseOnXPos(x) {
    for(var idx=0, length=volumeRangeList.length ; idx<length; idx++) {
      if(x < volumeRangeList[idx]) {
        return circleSizeList[idx];
      }
    }
    return circleSizeList[sectionCount-1];
  }

  function getLocationInSVG(y) {
    if( y < 0 ) {
      return 0;
    } else if (y <= svgHeight) {
      return y;
    } else {
      return svgHeight;
    }
  }

  this.startComposition = function() {
    var event = { type: 'mockOn', note: 'c#', timestamp: '134646', velocity: '0.5' };
    alert("작곡을 시작함돠~\n");
    formatter.createMIDI("Demo");
    formatter.sendEvent(event);
  };

  this.endComposition = function() {
    var event = { type: 'mockOff', note: 'c#', timestamp: '134646', velocity: '0.5' };
    alert("작곡을 끝냄돠~\n");
    formatter.saveMIDI();
    formatter.sendEvent(event);
  }

  function printDataToConsole(d) { console.log(d); }
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

// TODO: Timestamp와 실제 MIDI event의 매핑은 어떻게 해결할 것인가?
//      실제 Timestamp 값을 그대로 MIDI event의 time 값으로 쓸 수 있으면 좋겠지만, 그것이 아니라면 변환이 필요하다.
//      d3.scale.linear().domain( [start, end] ).range( [start, end] )
//      도메인에 해당하는 값을 넣으면, linear하게 range범위로 확장시켜줌. (normalize같은 경우도 가능)
function MIDIFormatter() {
  // mock-up
  this.sendEvent = function(event) {};
  this.createMIDI = function(MIDI_Information) {};
  this.saveMIDI = function() {};
}