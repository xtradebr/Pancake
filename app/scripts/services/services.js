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

angular.module('pancakeApp')
  .service('listhandler', function($http, $timeout) {

    var items = [];
    var dummy = [];

    return {
      items: items,
      busy: false,
      after: '',
      clear: function() {
        items = [];
      },
      setItems: function(list) {
        this.items = list;
      },
      setDummy: function(d) {
        dummy = d;
      },
      nextPage: function() {
        var that = this;

        console.log("Next Paging");
        if(this.busy) {
          return;
        }
        this.busy = true;

        dummy.forEach(function(item) {
          that.items.push(item);
        });
//      var url = '';
//      $http.get(url)
//        .success(function(data) {
//
//          //push data.data.chlidren to this.items
//
//          // this.after = next page or next element's id
//        }).bind(this);
        $timeout(function() {
          that.busy = false;
        }, 1000);
      }
    };
  });