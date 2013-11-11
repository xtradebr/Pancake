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
    var url = '';
    var isReachEnd = false;

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
      setUrl: function(u) {
        url = u;
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

        // TODO: implement to get elements list of next page depend on url.
//      $http.get(url)
//        .success(function(data) {
//          if( data.isReachEnd ) {
//            that.isReachEnd = data.isReachEnd;
//            return;
//          }
//          //push data.data.chlidren to this.items
//
//          // this.after = next page or next element's id
//        }).bind(this);
        $timeout(function() {
          that.busy = false;
        }, 500);
      }
    };
  });

angular.module('pancakeApp')
  .service('loginHandler', function($FB, $rootScope, $log, $notification, $location) {

    var loginStatus;
    var apiMe;

    $log.info("In Login Handler Service");

    this.login = function() {
      $log.info("Try Login!");

      $FB.login( function(res) {
        if(res.authResponse) {
          updateLoginStatus(updateApiMe);
          $rootScope.isLogged = true;
          $notification.success('Login Success!', 'have a good time with us :)');
        }
      });
    };

    this.logout = function() {
      $log.info("Try Logout!");

      $FB.logout(function () {
        updateLoginStatus(updateApiMe);
        $rootScope.isLogged = false;
        $location.place('/');
        $notification.info('Logout Successfully!', 'come again~ :)');
      });
    };

    function updateLoginStatus (more) {
      $FB.getLoginStatus(function (res) {
        loginStatus = res;

        (more || angular.noop)();
      });
    }

    function updateApiMe () {
      $FB.api('/me', function (res) {
        apiMe = res;
        $rootScope.loginInfo = " " + (apiMe.name || ' Log In');
      });
    }

    this.getName = function() {
      return (apiMe.name || 'guest');
    };

    return this;
  });