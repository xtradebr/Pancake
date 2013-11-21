'use strict';

var app = angular.module('pancakeApp', ['ui.bootstrap', 'ezfb', 'infinite-scroll', 'ui.keypress', 'notifications', 'ngClipboard']);

//uploadSocket that stays open from entering the site until leaving the site
var uploadSocket = io.connect('http://www.soundpancake.io');
//var uploadSocket = io.connect('http://54.250.201.108');

app.config(function ($routeProvider, $locationProvider, $FBProvider) {
  $locationProvider.html5Mode(false).hashPrefix('!');

  $FBProvider.setInitParams({
    appId: '1418276715068674'
  });

  $routeProvider
    .when('/home', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl',
      title: 'Home',
      isInEditor: false
    })
    .when('/editor', {
      templateUrl: 'views/editor.html',
      controller: 'EditorCtrl',
      title: 'Editor',
      isInEditor: true
    })
    .when('/musiclist', {
      templateUrl: 'views/musiclist.html',
      controller: 'MusicListCtrl',
      title: 'Music List',
      isInEditor: false
    })
    .when('/playlist', {
      templateUrl: 'views/playlist.html',
      controller: 'PlayListCtrl',
      title: 'Play List',
      isInEditor: false
    })
    .when('/about', {
      templateUrl: 'views/about.html',
      title: 'About',
      isInEditor: false
    })
    .when('/dashboard', {
      templateUrl: 'views/dashboard.html',
      controller: 'DashboardCtrl',
      title: 'Dashboard',
      isInEditor: false
    })
    .when('/share/:id', {
      templateUrl: 'views/sharing.html',
      controller: 'ShareCtrl',
      title: 'Sharing',
      isInEditor: false
    })
    .otherwise({
      redirectTo: '/home'
    });
});

app.run(function ($rootScope, $location, $modal, loginHandler, listhandler) {
  $rootScope.$on('$routeChangeSuccess', function(event, currentRoute) {
    $rootScope.title = currentRoute.title;
    $rootScope.isInEditor = currentRoute.isInEditor;

    listhandler.clear();

    if($rootScope.isInEditor){
      $('body').css('margin-bottom',0);
    }
    else{
      $('body').css('margin-bottom',$('footer').css('height'));
    }
  });

  $rootScope.login = function() {

    if(!$rootScope.isLogged) {
      var modalInstance = $modal.open({
          templateUrl: '/views/login.html',
          controller: 'LoginCtrl'
        }
      );

      modalInstance.result.then(function() {
        console.log("Is Login Successed?");
        // no there is possible that user doesn't logged in facebook.
      }, function() {
        console.log("Login cancel");
      });
    }
  };

  $rootScope.logout = function() {
    loginHandler.logout();
  };

  $rootScope.loginInfo = ' Log In';
  $rootScope.isLogged = false;

  uploadSocket.emit('test', 'hello uploadSocket-world');

});

