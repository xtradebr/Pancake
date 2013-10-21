/**
 * MIDI File Editor Script.
 *
 * User: ipark
 * Date: 13. 8. 16.
 * Time: 오후 5:53
 */
'use strict';

var app = angular.module('pancakeApp');
app.controller('EditorCtrl', function($scope) {

  // MidiController가 할 일
  // Editor로부터 전송된 event를 MIDI로 전송할 포맷에 맞게 변경한 후
  // MIDI에 sendEvent를 하는 것
  var MidiController = function() {

    // 강호가 만든 MIDI 모듈이 들어갈 자리.
    // 해당 모듈은 MidiController 내부에서만 존재하고,
    // 외부로 노출된 sendEvent가 위임해주는 이벤트를 미디 파일에 기록한다.
//    var module = new MidiModule();
    var module;
    // 48 = C, 49 = C#, ...
    // 넘겨줄 데이터 = pitch, dt
    var pitch = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

    var formatting = function(event) {
      return {
        pitch: pitch[event.pitch],
        startTime: event.startTime,
        dt: event.endTime-event.startTime
      };
    };

    return {
      sendEvent: function(event) {
        module.sendEvent( formatting(event) );
      }
    };
  }( );

  $scope.noteList = new LinkedList();
  $scope.emit = function(event) {
    $scope.timeline.emit(event);
//    MidiController.sendEvent(event);
  };

  // TODO: impl after integration with midi player
  $scope.startComposition = function() {
  };
  $scope.endComposition = function() {
    console.log($scope.noteList.size());
  };

});

// TODO: 가장 시급한 TODO, 모든 애니메이션이 하나의 clock과 동기화 되거나, 같은 주기의 tick_clock을 가져야 한다.
// 지금은 제각각 따로 놀고 있다 -_-;; 그래서 무슨 횡스크롤 액션 배경마냥 depth가 생겨버렸다.
// timeline을 그린 후에 해결하자.
app.directive('editorVisualization', function() {

  var editor;

  function initEditor(scope) {
    return new PanelEditor( d3.select('#editor'), scope );
  }

  return {
    restrict: 'E',
    // 초기화, 템플릿안에 ng-repeat이 없다면 한번만 실행됨.
    link: function(scope, element, attr) {
      editor = initEditor(scope);
      scope.editor = editor;
    }
  };
});

app.directive('timelineVisualization', function() {

  var timeline;

  function initTimeline(scope) {
    return new TimelineEditor( d3.select('#timeline'), scope );
  }

  return {
    restrict: 'E',
    link: function(scope, element, attr) {
      timeline = initTimeline(scope);
      scope.timeline = timeline;
    }
  };
});

// TODO: Separation of Concerns은 자바스크립트에 대해 좀 더 이해한 후에 진행.
function PanelEditor(svg, scope) {
  svg.on('mousedown', down)
    .on('mouseup', up)
    .on('mousemove', move);

  var pointerCircle;

  // TODO: need to re-calculate event when window size changed
  var svgWidth = DrawingUtility.getSVGWidth(svg),
      svgHeight = DrawingUtility.getSVGHeight(svg),
      xPos = svgWidth/2,

      pitch = DrawingUtility.getPitch(svgHeight),
      midInPitch = DrawingUtility.getMiddleYInPitch(pitch),
      currentPitch = 4,

      mousePosition = [xPos, svgHeight/2],
      barHeight = DrawingUtility.calcBarHeight(pitch);

  var clicked = false;

  var recording = function() {
    // TODO: startComposition 버튼을 누르면 true로 바뀌도록 구현 후 onGoing 기본 값을 false로 바꾸기
    var onGoing = true;
    return {
      start: function() { onGoing = true; },
      stop: function() { onGoing = false; },
      isStillOnProgress: function() { return onGoing; },
      isDone: function() { return !onGoing; }
    };
  }( );

  var BeatBarManager = function() {
    var startX = svgWidth + 20;
    var BeatBarPool = function() {
      var pool = [];
      for(var i=0; i<10; i++) {
        pool[i] = svg.append('svg:line')
          .attr('x1', startX)
          .attr('y1', 0)
          .attr('x2', startX)
          .attr('y2', svgHeight)
          .style('stroke', 'rgb(125, 125, 125)')
          .style('stroke-width', 5);
      }

      var idx = 0, length = pool.length;

      return {
        getBeatBar: function() {
          return pool[(idx++)%length];
        }
      };
    }( );

    return {
      beatBarReDraw: function(bar) {
        var current = bar.attr('x1');
        bar.transition()
          .attr('x1', current-Animator.dx)
          .attr('x2', current-Animator.dx)
          .duration('1');

        return ( current < 0 );
      },
      beatBarRemove: function(bar) {
        bar.transition()
          .attr('x1', startX)
          .attr('x2', startX)
          .duration('1');
      },
      getBeatBar: function() {
        return BeatBarPool.getBeatBar();
      }
    };
  }( );

  var NoteBarAnimManager = function() {
    return {
      noteBarIncreasingReDraw: function(note) {
        note.transition()
          .attr('x2', note.attr('x2')-Animator.dx)
          .duration('1');

        return upHandler.isUped();
      },
      noteBarFlow: function(note) {
        upHandler.upClear();
        // TODO: Midi Note Off timing
        if( note.attr('x1')-note.attr('x2') < Animator.dx ) {
          note.remove();
          return;
        }

        var floatingNote = new AnimatableObj(note,
                                              NoteBarAnimManager.noteBarMovingReDraw,
                                              NoteBarAnimManager.noteBarRemove);
        Animator.push(floatingNote);
        scope.emit( {
            data: note,
            pitch: note.currentPitch,
            startTime: note.clickedTime,
            endTime: Animator.currentTime()
          }
        );
      },
      noteBarMovingReDraw: function(note) {
        var x1 = note.attr('x1'),
            x2 = note.attr('x2');
        note.transition()
          .attr('x1', x1-Animator.dx)
          .attr('x2', x2-Animator.dx)
          .duration('10');

        return ( x1 < 0 );
      },
      noteBarRemove: function(note) {
        note.remove();
      }
    };
  }( );

  var upHandler = function() {
    var isUp = false;
    return {
      upOnce: function() { isUp = true; },
      isUped: function() { return isUp; },
      upClear: function() { isUp = false; }
    };
  }( );

  // draw background
  (function() {
    pointerCircle = svg.append('svg:circle')
      .attr('cx', xPos)
      .attr('cy', svgHeight/2)
      .attr('r', 20)
      .attr('stroke', '#1f77b4')
      .attr('stroke-width', 3)
      .style('stroke-opacity', 1);

    svg.append('rect')
      .attr('class', 'standard_bar')
      .attr('x', xPos)
      .attr('y', 0)
      .attr('width', 2)
      .attr('height', svgHeight);

    for(var i=1; i<DrawingUtility.pitchCount; i++) {
      svg.append('rect')
        .attr('class', 'standard_bar')
        .attr('x', 0)
        .attr('y', pitch(i))
        .attr('width', svgWidth)
        .attr('height', 1);
    }
  })( );

  // draw editor animation
  (function() {
    setInterval( function() {
      drawBeatBar();
    }, 2000);
  })( );

  function up() {
    upHandler.upOnce();
    clicked = false;
  }

  function move() {
    /*jshint validthis:true */
    mousePosition = d3.mouse(this);
    pointerCircle.attr('cy', mousePosition[1]);
    // state(clicked): 기존의 진행중인 bar 중단 + 새로운 bar 추가
    // state(notClicked): 아무런 변화 없음
    if( clicked && isCrossBorder(mousePosition[1]) && semaphore.canConsume() ) {
      up();
      down();
    }
  }

  function down() {
    if( recording.isDone() ) {
      return;
    }
    clicked = true;
    semaphore.consume();

    currentPitch = getCurrentPitchUsingMousePosition( getLocationInSVG(mousePosition[1]) );

    var note = svg.append('line')
      .attr('x1', xPos).attr('y1', midInPitch[currentPitch])
      .attr('x2', xPos).attr('y2', midInPitch[currentPitch])
      .attr('class', 'bar')
      .style('stroke-width', barHeight);

    drawNoteBar(note);
  }

  function drawNoteBar(bar) {
    bar.currentPitch = currentPitch;
    bar.clickedTime = Animator.currentTime();
    var note = new AnimatableObj(bar,
                                  NoteBarAnimManager.noteBarIncreasingReDraw,
                                  NoteBarAnimManager.noteBarFlow);
    Animator.push(note)
    // TODO: Midi Note On timing
  }

  function drawBeatBar() {
    var bar = new AnimatableObj(BeatBarManager.getBeatBar(),
                                BeatBarManager.beatBarReDraw,
                                BeatBarManager.beatBarRemove);
    Animator.push(bar);
  }

  function isCrossBorder(y) {
    return ( currentPitch !== getCurrentPitchUsingMousePosition(y) );
  }

  function getCurrentPitchUsingMousePosition(y) {
    for(var i=DrawingUtility.pitchCount; i>=0; i--) {
      if(y > pitch(i)) {
        return i;
      }
    }
    return 0;
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
}

// TODO: when totalTime changed, existed notes have to be changed.
function TimelineEditor(svg, scope) {
  var svgWidth = DrawingUtility.getSVGWidth(svg),
      svgHeight = DrawingUtility.getSVGHeight(svg),

      xBorder = d3.round(svgWidth*0.1),
      yBorder = d3.round(svgHeight*0.3),
      drawAreaWidth = svgWidth - xBorder,

      pitch = DrawingUtility.getPitch(svgHeight - yBorder - d3.round(svgHeight*0.03)),
      midInPitch = DrawingUtility.getMiddleYInPitch(pitch),
      barHeight = DrawingUtility.calcBarHeight(pitch);

  var totalTime = 30, dt = 15,
      EditorTotalLength = totalTime * Animator.fps * Animator.dx,
      BarTransformRate = drawAreaWidth / EditorTotalLength,
      noteList = [];

  midInPitch.forEach(function(element, index, array) {
    array[index] += yBorder + d3.round(svgHeight*0.02);
  });

  // draw background
  (function() {
    var timeYPos = d3.round(svgHeight*0.2);

    // vertical divider bewteen edit layer and information layer
    svg.append('rect')
      .attr('class', 'division_bar')
      .attr('x', xBorder)
      .attr('y', 0)
      .attr('width', 2)
      .attr('height', svgHeight);

    // horizontal divider between time indicator layer and edit layer
    svg.append('rect')
      .attr('class', 'division_bar')
      .attr('x', 0)
      .attr('y', yBorder)
      .attr('width', svgWidth)
      .attr('height', 2);

    // Instrument Information
    svg.append('text')
      .attr('x', xBorder/2)
      .attr('y', d3.round(svgHeight*0.7))
      .text('Piano')
      .attr('font-size', '20px');

    // Total Time Information
    // TODO: Refactoring text contents - changed by total time
    svg.append('text')
      .attr('class', 'total_time')
      .attr('x', xBorder/2)
      .attr('y', timeYPos)
      .text(timeFilter(totalTime));

    for(var i=1; i<=3; i++) {
      var x = xBorder + (svgWidth-xBorder)*i/4;
      // Time Indicator Divider
      svg.append('rect')
        .attr('class', 'division_bar')
        .attr('x', x)
        .attr('y', 0)
        .attr('width', 2)
        .attr('height', d3.round(svgHeight*0.3));

      // Time Indicator Information
      // TODO: Refactoring text contents - changed by total time
      svg.append('text')
        .attr('class', 'time_indicator')
        .attr('x', x + 30)
        .attr('y', timeYPos)
        .text(timeFilter(totalTime *i/4));
    }
  })( );

  this.emit = function(event) {
    var transformedNote = drawNoteBar(event);
    noteList.push(transformedNote);
  };

  function drawNoteBar(event) {
    var origin = event.data,
        currentPitch = event.pitch,
        originLen = d3.round(origin.attr('x1') - origin.attr('x2')),
        x = xBorder + event.startTime * drawAreaWidth / totalTime;

    return svg.append('line')
      .attr('x1', x)
      .attr('x2', x + (originLen * BarTransformRate))
      .attr('y1', midInPitch[currentPitch])
      .attr('y2', midInPitch[currentPitch])
      .attr('class', 'bar')
      .style('stroke-width', barHeight);
  }

  // make second to mm:ss formate
  function timeFilter(second) {
    function toDoubleDigit(d) {
      return (d<10)? '0'+d : d;
    }
    second = Math.floor(second);
    var m = 0, s = second%60;

    if( second >= 60 ) {
      m = Math.floor( second/60 );
    }
    m = toDoubleDigit(m);
    s = toDoubleDigit(s);

    return (m+':'+s);
  }
}

var DrawingUtility = function() {
  var pitchCount = 12;
  return {
    getSVGWidth: function(svg) { return parseInt(svg.style('width'), 10); },
    getSVGHeight: function(svg) { return parseInt(svg.style('height'), 10); },
    getPitch: function(height) { return d3.scale.linear().domain([0,pitchCount]).rangeRound([0,height]); },
    getMiddleYInPitch: function(pitch) {
      var mid = d3.round((pitch(1)-pitch(0))/2), d = [];

      for(var i=0; i<pitchCount; i++) {
        d[i] = pitch(i)+mid;
      }
      return d;
    },
    calcBarHeight: function(pitch) { return d3.round( d3.round((pitch(1)-pitch(0))/2) * 1.6 ); },
    pitchCount: pitchCount
  };
}( );

// Global tick을 가지고 있는 단일 스레드 모델의 Animator이다.
// Observer 패턴을 구현했다고 봐도 무방하다. Observer의 update 함수가 reDraw와 remove 함수다.
var Animator = function() {
  var tick = 0,
      fps = 36,
      activeObjs = [],
      animationId;

  animationId = setInterval( function() {

    // Animation Start
    semaphore.release();
    tick += 1;
    activeObjs.forEach(reDraw);
    // Animation End

    if( tick%fps === 0 ) {
//      console.log(tick/fps);
    }

    function reDraw(element, index, array) {
      var isReachEnd = element.reDraw();
      if( isReachEnd ) {
        array.splice(index, 1);
        element.remove();
      }
    }
  }, Math.floor(1000/fps));

  return {
    dx: 10,
    fps: fps,
    push: function(obj) { activeObjs.push(obj); },
    currentTime: function() { return tick/fps; }
  };
}( );

// 객체 스스로가 repaint, remove 행동에 대한 책임이 있음
// animatableObj는 Animator가 조작하는 단순한 container
var AnimatableObj = function(obj, reDrawFunc, removeFunc) {
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

// 객체가 추가되는 시점을 Animator의 tick과 동기화되도록 해주는 Critical Section
// wait(consume) is called when mouse down event occurs
// release is called when Animator's time interval occurs
var semaphore = function() {
  var state = true;
  return {
    consume: function() { state = false; },
    release: function() { state = true; },
    canConsume: function() { return state; }
  };
}( );

var player;
MIDI.loadPlugin(function () {
  player = MIDI.Player;
});