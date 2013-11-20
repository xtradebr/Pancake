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
    var url = '';
    var param = {};
    var isReachEnd = false;

    var dummy = [];

    return {
      items: items,
      busy: false,
      toggleBusy: function() { this.busy = !this.busy; },
      after: 1,
      clear: function() {
        param = {"page": 1};
        this.items = [];
        this.after = 1;
      },
      setItems: function(list) {
        this.items = list;
      },
      setDummy: function(d) {
        this.dummy = d;
      },
      setUrl: function(u) {
        url = u;
      },
      setParam: function(p) {
        param = p;
      },
      nextPage: function() {
        var that = this;

        if(that.busy) {
          return;
        }
        that.toggleBusy();
        param.page = that.after;

        console.log("listHandler of " + url + "/" + JSON.stringify(param));

        $http.post(url, param)
          .success(function(data) {
          that.items = that.items.concat(data.list);

          if(data.list.length !== 0) {
            that.after = param.page + 1;
            that.toggleBusy();
          } else {
            $timeout(function() {
              that.toggleBusy();
            }, 1000);
          }
        });
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
