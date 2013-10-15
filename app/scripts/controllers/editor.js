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

  var BeatBarManager = function() {
    var startX = svgWidth + 20;
    var BeatBarPool = function() {
      var pool = [];
      for(var i=0; i<10; i++) {
        pool[i] = svg.append("svg:line")
          .attr("x1", startX)
          .attr("y1", 0)
          .attr("x2", startX)
          .attr("y2", svgHeight)
          .style("stroke", "rgb(125, 125, 125)")
          .style("stroke-width", 5);
      }

      var idx = 0, length = pool.length;

      return {
        getBeatBar: function() {
          return pool[(idx++)%length];
        }
      }
    }( );

    return {
      beatBarReDraw: function(bar) {
        var current = bar.attr("x1");
        bar.transition()
          .attr("x1", current-Animator.dx)
          .attr("x2", current-Animator.dx)
          .duration("10");

        return ( current < 0 );
      },
      beatBarRemove: function(bar) {
        console.log("Inner Remove!");
        bar.transition()
          .attr("x1", startX)
          .attr("x2", startX)
          .duration("1");
      },
      getBeatBar: function() {
        return BeatBarPool.getBeatBar();
      }
    }
  }( );

  var NoteBarAnimManager = function() {
    return {
      noteBarIncreasingReDraw: function(note) {
        var x2 = note.attr("x2");
        note.transition()
          .attr("x2", x2-Animator.dx)
          .duration("10");

        return upHandler.isUped();
      },
      noteBarFlow: function(note) {
        upHandler.upClear();

        var floatingNote = new animatableObj(note,
                                              NoteBarAnimManager.noteBarMovingReDraw,
                                              NoteBarAnimManager.noteBarRemove);
        Animator.push(floatingNote);
      },
      noteBarMovingReDraw: function(note) {
        var x1 = note.attr("x1"),
            x2 = note.attr("x2");
        note.transition()
          .attr("x1", x1-Animator.dx)
          .attr("x2", x2-Animator.dx)
          .duration("10");

        return ( x1 < 0 );
      },
      noteBarRemove: function(note) {
        note.remove();
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
    setInterval( function() {
      drawBeatBar();
    }, 2000);
  }( );

  function up() {
    upHandler.upOnce();
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
    clicked = true;

    var yIdx = getCurrentPitchUsingMousePosition( getLocationInSVG(mousePosition[1]) );

    var note = svg.append("line")
      .attr("x1", xPos).attr("y1", midInPitch[yIdx])
      .attr("x2", xPos).attr("y2", midInPitch[yIdx])
      .attr("class", "bar")
      .style("stroke-width", bar_height);

   drawNoteBar(note);
  }

  function drawNoteBar(bar) {
    var note = new animatableObj(bar,
                                  NoteBarAnimManager.noteBarIncreasingReDraw,
                                  NoteBarAnimManager.noteBarFlow);
    Animator.push(note);
  }

  function drawBeatBar() {
    var bar = new animatableObj(BeatBarManager.getBeatBar(),
                                BeatBarManager.beatBarReDraw,
                                BeatBarManager.beatBarRemove);
    Animator.push(bar);
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

// Global tick을 가지고 있는 단일 스레드 모델의 Animator이다.
// Observer 패턴을 구현했다고 봐도 무방하다. Observer의 update 함수가 reDraw와 remove 함수다.
var Animator = function() {
  var tick = 0,
      frame = 36, cps = Math.floor(1000/frame),
      activeObjs = [];

  var stats = function() {
    var obj = new Stats();

    obj.setMode(0); // 0: fps, 1: ms

    obj.domElement.style.position = 'absolute';
    obj.domElement.style.left = 50 + 'px';
    obj.domElement.style.top = 600 + 'px';

    document.body.appendChild( obj.domElement );

    return obj;
  }( );

  setInterval( function() {
    stats.begin();
    tick++;
    activeObjs.forEach(reDraw);
    stats.end();

    function reDraw(element, index, array) {
      var isReachEnd = element.reDraw();
      if( isReachEnd ) {
        array.splice(index, 1);
        element.remove();
      }
    }
  }, cps);

  return {
    dx: 10,
    push: function(obj) {
      activeObjs.push(obj);
    }
  }
}( );

// 객체 스스로가 repaint, remove 행동에 대한 책임이 있음
// animatableObj는 Animator가 조작하는 단순한 container
var animatableObj = function(obj, reDrawFunc, removeFunc) {
  var object      = obj,
      innerReDraw = reDrawFunc,
      innerRemove = removeFunc;

  this.reDraw = function() {
    return innerReDraw(object);
  };
  this.remove = function() {
    innerRemove(obj);
  };
};