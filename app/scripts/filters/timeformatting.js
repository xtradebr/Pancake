/**
 * Created by ipark on 2013. 11. 5..
 */

angular.module('pancakeApp')
  .filter('secondToMMSS', function() {

    // make second to mm:ss format
    return function(second) {
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
  });