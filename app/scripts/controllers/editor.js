/**
 * MIDI File Editor Script.
 *
 * User: ipark
 * Date: 13. 8. 16.
 * Time: 오후 5:53
 */
'use strict';

var app = angular.module('pancakeApp');
app.controller('EditorCtrl', function($scope, sharedProperties) {

  $scope.noteList = new LinkedList();

  $scope.score = sharedProperties.getProperty().score;

  $scope.startComposition = function() {
    $scope.editor.startComposition();
  };

  $scope.endComposition = function() {
//    $scope.editor.endComposition();
    console.log($scope.noteList.size());
  };

});

// TODO: 가장 시급한 TODO, 모든 애니메이션이 하나의 clock과 동기화 되거나, 같은 주기의 tick_clock을 가져야 한다.
// 지금은 제각각 따로 놀고 있다 -_-;; 그래서 무슨 횡스크롤 액션 배경마냥 depth가 생겨버렸다.
// timeline을 그린 후에 해결하자.
app.directive('editorVisualization', function() {

  var editor;

  return {
    restrict: 'E',
    // 초기화, 템플릿안에 ng-repeat이 없다면 한번만 실행됨.
    link: function(scope, element, attr) {
      editor = initEditor(scope);
      scope.editor = editor;
    }
  };

  function initEditor(scope) {
    return new PanelEditor( d3.select("#editor"), scope );
  }

});

app.directive('timelineVisualization', function() {

  var timeline;

  return {
    restrict: 'E',
    link: function(scope, element, attr) {
      timeline = initTimeline(scope);
      scope.timeline = timeline;
    }
  };

  function initTimeline(scope) {
    return new TimelineEditor( d3.select("#timeline"), scope );
  }
});

// TODO: Separation of Concerns은 자바스크립트에 대해 좀 더 이해한 후에 진행.
function PanelEditor(svg, scope) {
//  var stats = new Stats();
//  stats.setMode(0); // 0: fps, 1: ms
//
//  stats.domElement.style.position = 'absolute';
//  stats.domElement.style.left = xPos + 'px';
//  stats.domElement.style.top = svgHeight + 'px';
//
//  document.body.appendChild( stats.domElement );

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

  var clicked = false;
  var noteList = scope.noteList;

  var recording = function() {
    // TODO: startComposition 버튼을 누르면 true로 바뀌도록 구현 후 onGoing 기본 값을 false로 바꾸기
    var onGoing = true;
    return {
      start: function() { onGoing = true; },
      stop: function() { onGoing = false; },
      isStillOnProgress: function() { return onGoing; },
      isDone: function() { return !onGoing; }
    }
  }( );

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

    drawBeatBar();
  }( );

  // dynamic images (animation)
  var startAnimation = function() {

  }( );

  var BeatBarPool = function() {
    var pool = [];
    for(var i=0; i<10; i++) {
      pool[i] = svg.append("svg:line")
                    .attr("x1", svgWidth)
                    .attr("y1", 0)
                    .attr("x2", svgWidth)
                    .attr("y2", svgHeight)
                    .style("stroke", "rgb(125, 125, 125)")
                    .style("stroke-width", 1);
    }

    var idx = 0, length = pool.length;

    return {
      getBeatBar: function() {
        return pool[(idx++)%length];
      }
    }
  }( );

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

  function down() {
    if( recording.isDone() ) {
      return;
    }

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

      if( !clicked && recording.isStillOnProgress() ) {
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
    // diffuse 함수는 마우스 액션에 관계없이 독립적으로 왼쪽으로 흐를 수 있도록 만들어주는 함수.
    // diffuse 함수를 호출하는 시점부터 오로지 '작곡이 진행 중 인가' 여부에만 영향을 받음
    function diffuse() {
      d3.timer(function() {
//        var current = bar.attr("x1");
        bar.transition()
          .attr("x1", bar.attr("x1")-dx)
          .attr("x2", bar.attr("x2")-dx)
//          .attr("transform", "translate("+(-xPos)+",0)")
          .ease("linear")
          .duration(20);

        if( bar.attr("x1") < 0 ) {
          noteList.add( {name: 'bar pushed'} );
          bar.remove();
          return true;
        }

        return recording.isDone();
      });
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

  function drawBeatBar() {
    var tick = 0;
    d3.timer( function() {
      // TODO: (++tick)%50 이라는 timing을 전체 시간축과 맞추기
      if( (++tick)%50 == 0) {
      BeatBarPool.getBeatBar()
        .transition()
        .attr("transform", "translate("+(-svgWidth)+")")
        .ease("linear")
        .duration(4000)
        .each("end", function() {
          d3.select(this)
            .attr("transform", "");
        });
      }
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
//    alert("작곡을 시작함돠~\n");
    formatter.createMIDI("Demo");
    formatter.sendEvent(event);
  };

  this.endComposition = function() {
    var event = { type: 'mockOff', note: 'c#', timestamp: '134646', velocity: '0.5' };
//    alert("작곡을 끝냄돠~\n");
    formatter.saveMIDI();
    formatter.sendEvent(event);
  };

  function printDataToConsole(d) { console.log(d); }
}

function TimelineEditor(svg, scope) {

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