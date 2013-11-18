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
    var param = {};
    var isReachEnd = false;

    return {
      items: items,
      busy: false,
      after: 1,
      clear: function() {
        this.items = [];
        this.after = 1;
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
      setParam: function(p) {
        param = p;
      },
      nextPage: function() {
        var that = this;

        console.log("Next Paging");
        if(this.busy) {
          return;
        }
        this.busy = true;
        param.page = this.after;


        console.log("listHandler of " + url + "/" + JSON.stringify(param));

        $http.post(url, param)
          .success(function(data) {
          if( data.isReachEnd ) {
            that.isReachEnd = data.isReachEnd;
            return;
          }
          //push data.data.chlidren to this.items
          console.log("res data in list handler: ");
          console.log(data.list);
          data.list.forEach(function(item) {
            that.items.push(item);
          });
          // this.after = next page or next element's id
          that.after = param.page + 1;
        });
        $timeout(function() {
          that.busy = false;
        }, 3000);
      }
    };
  });

angular.module('pancakeApp')
  .service('loginHandler', function($FB, $rootScope, $log, $notification, $location) {

    var loginStatus;
    var apiMe = {
      name: 'guest',
      username: 'guest'
    };

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
        $location.path('/');
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
        $log.info(apiMe);
      });
    }

    this.getName = function() {
      return (apiMe.name || 'guest');
    };
    this.getID = function() {
      return (apiMe.username || 'guest');
    };
    this.getUID = function() {
      return (apiMe.id || "guest");
    };

    return this;
  });
