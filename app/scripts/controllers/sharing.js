'use strict';

angular.module('pancakeApp')
  .controller('ShareCtrl', function($scope) {

    $scope.music = {
      'id': 1234,
      'title': 'stronger',
      'artist': 'Britney Spears',
      'owner': undefined,
      'playtime': 300,
      'like': 123,
      'comment': 10,
      'description': 'if you feel weak, check this song out!',
      'albumArt': 'images/stronger.png',
      'MidiFileId': 1234, //obsolete (dummy)
      'share': 'http://www.soundpancake.io/share/125402525',
      'data': {}
    };

    $scope.$on('$routeChangeSuccess', function(next, current) {
      // http.post( musiclist, {id : (id in url) } )
      //   .success(
      //      playSlider.add( this song )
      //   );
    });
  });