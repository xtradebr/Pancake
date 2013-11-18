/**
 * Created by ipark on 2013. 11. 5..
 */

'use strict';

angular.module('pancakeApp')
  .filter('shortString', function() {

  return function(string, size) {

    if( size === undefined ) {
      size = 20;
    }
    if( string === undefined ) {
      string = "";
    }
    if( string.length > size ) {
      return string.substr(0, size) + '...';
    } else {
      return string;
    }
  };
});
