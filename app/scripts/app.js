'use strict';

var app = angular.module('pancakeApp', ['ui.bootstrap', 'ezfb', 'infinite-scroll']);

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
      isInEditor: false,
      isLogged: false
    })
    .when('/editor', {
      templateUrl: 'views/editor.html',
      controller: 'EditorCtrl',
      title: 'Editor',
      isInEditor: true,
      isLogged: false
    })
    .when('/musiclist', {
      templateUrl: 'views/musiclist.html',
      controller: 'MusicListCtrl',
      title: 'Music List',
      isInEditor: false,
      isLogged: false
    })
    .when('/playlist', {
      templateUrl: 'views/playlist.html',
      controller: 'PlayListCtrl',
      title: 'Play List',
      isInEditor: false,
      isLogged: false
    })
    .when('/about', {
      templateUrl: 'views/about.html',
      controller: 'AboutCtrl',
      title: 'About',
      isInEditor: false,
      isLogged: false
    })
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl',
      title: 'Login',
      isInEditor: false,
      isLogged: false
    })
    .otherwise({
      redirectTo: '/home'
    });
});

app.run(function ($rootScope, $location) {
  $rootScope.$on('$routeChangeSuccess', function(event, currentRoute) {
    $rootScope.title = currentRoute.title;
    $rootScope.isInEditor = currentRoute.isInEditor;
  });

  $rootScope.login = function() {
    if(!$rootScope.isLogged) {
      $location.path('/login');
    }
  };

  $rootScope.isLogged = true;
});