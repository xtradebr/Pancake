/**
 * MIDI File Editor Script.
 *
 * User: ipark
 * Date: 13. 8. 16.
 * Time: 오후 5:53
 */
'use strict';

angular.module('pancakeApp')
  .controller('EditorCtrl', function($scope, sharedProperties) {

    $scope.score = sharedProperties.getProperty().score;

    $scope.startComposition = function() {
//      $scope.editor.startComposition();
      $scope.editor.test();
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
  var pointerCircle;

  // TODO: need to re-calculate event when window size changed
  var svgWidth = parseInt(svg.style("width")),
      svgHeight = parseInt(svg.style("height")),
      xPos = svgWidth/2,

      pitch = d3.scale.linear().domain([0,9]).rangeRound([0,svgHeight]),
      midInPitch = getMiddleYInPitch(),
      currentPitch = 4,

      mousePosition = [xPos, svgHeight/2],
      bar_height;

  var clicked = false, onGoing = true;

  // static images
  var drawBackground = function() {

    pointerCircle = svg.append("svg:circle")
      .attr("cx", xPos)
      .attr("cy", svgHeight/2)
      .attr("r", 20)
      .attr("stroke", ColorSet.nextColor())
      .attr("stroke-width", 3)
      .style("stroke-opacity", 1);

    svg.append("rect")
      .attr("class", "standard_bar")
      .attr("x", xPos)
      .attr("y", 0)
      .attr("width", 2)
      .attr("height", svgHeight);

    for(var i=1; i<9; i++) {
      svg.append("rect")
        .attr("class", "standard_bar")
        .attr("x", 0)
        .attr("y", pitch(i))
        .attr("width", svgWidth)
        .attr("height", 1);
    }
  }( );

  // dynamic images (animation)
  var startAnimation = function() {

  }( );

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
  };

  function down() {
    var tick  = 0,
        yIdx  = getCurrentPitchUsingMousePosition( getLocationInSVG(mousePosition[1]) ),
        bar, dx = 5;

        currentPitch = yIdx;
        clicked   = true;

        bar = svg.append("line")
          .attr("x1", xPos).attr("y1", midInPitch[yIdx])
          .attr("x2", xPos).attr("y2", midInPitch[yIdx])
          .attr("class", "bar")
          .style("stroke-width", bar_height);

          d3.timer(function() {
            bar.transition()
              .attr("x2", d3.round(xPos-tick))
              .ease("linear");
              tick += dx;

            if( !clicked && onGoing ) {
              diffuse(bar);
            }

            if( upHandler.isUped() ) {
              upHandler.upClear();
              if( tick > 30 ) {
                diffuse(bar);
              } else {
                bar.remove();
              }
              return true;
            }
            return !clicked;
          });

    // diffuse 함수 자체에 timer 붙이기. onGoing 일 동안 스스로를 translate 시킴
    // dx는 down 내의 dx 만큼.
    function diffuse() {
      bar.transition()
        .attr("transform", "translate("+(-xPos)+",0)")
        .ease("linear")
        .duration(2000)
        .remove();
    }
  }

  var upHandler = function() {
    var isUp = false;
    return {
      upOnce: function() { isUp = true; },
      isUped: function() { return isUp; },
      upClear: function() { isUp = false; }
    }
  }( );

  function up() {
    clicked = false;
    // TODO: push bar data to score.
  }

  function move() {
    mousePosition = d3.mouse(this);
    pointerCircle.attr("cy", mousePosition[1]);
    // state(clicked): 기존의 진행중인 bar 중단 + 새로운 bar 추가
    // state(notClicked): 아무런 변화 없음
    if( clicked && isCrossBorder(mousePosition[1]) ) {
      upHandler.upOnce();
      up();
      down();
    }
  }

  function isCrossBorder(y) {
    return ( currentPitch != getCurrentPitchUsingMousePosition(y) );
  }

  function getCurrentPitchUsingMousePosition(y) {
    for(var i=9; i>=0; i--) {
      if(y > pitch(i)) {
        return i;
      }
    }
    return 0;
  }

  // timer를 이용해서 그려주기
  function drawBeatBar(speed) {

    BeatBarPool.getBeatBar()
      .transition()
      // .attr("transform", "translate("+(-xPos)+")")
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

  function getMiddleYInPitch() {
    var mid = d3.round((pitch(1)-pitch(0))/2), d = [];
    bar_height = d3.round(mid*1.6);

    for(var i=0; i<9; i++) {
      d[i] = pitch(i)+mid;
    }
    return d;
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
  };

  function printDataToConsole(d) { console.log(d); }
}

var ColorSet = function() {
  var current = 0,
      set = d3.scale.category10();

  return {
    getColor: function() {
      return set(current);
    },
    nextColor: function() {
      current = (current+1)%10;
      return this.getColor();
    }
  }
}( );

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