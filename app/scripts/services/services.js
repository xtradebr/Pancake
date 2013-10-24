/**
 * Created by ipark on 13. 10. 10..
 */
'use strict';

angular.module('pancakeApp')
  .service('sharedProperties', function () {

    var property = {
      score: { title: '', beat: '', bpm: '' }
    };

    return {
      getProperty: function () {
        return property;
      },
      setProperty: function (value) {
        property = value;
      }
    };
  });