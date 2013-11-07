'use strict';

var app = angular.module('pancakeApp', ['ui.bootstrap']);

app.config(function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(false).hashPrefix('!');

  $routeProvider
    .when('/home', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl',
      title: 'Home'
    })
    .when('/editor', {
      templateUrl: 'views/editor.html',
      controller: 'EditorCtrl',
      title: 'Editor'
    })
    .when('/playlist', {
      templateUrl: 'views/playlist.html',
      controller: 'PlayListCtrl',
      title: 'Play List'
    })
    .when('/about', {
      templateUrl: 'views/about.html',
      controller: 'AboutCtrl',
      title: 'About'
    })
    .when('/login', {
      templateUrl: 'views/login.html',
      contorller: 'LoginCtrl',
      title: 'Login'
    })
    .otherwise({
      redirectTo: '/home'
    });
});

app.run(function ($rootScope) {
  $rootScope.$on('$routeChangeSuccess', function(event, currentRoute) {
    $rootScope.title = currentRoute.title;
  });
});
