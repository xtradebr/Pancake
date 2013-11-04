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
    .when('/musiclist', {
      templateUrl: 'views/musiclist.html',
      controller: 'MusicListCtrl',
      title: 'Music List'
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
    .otherwise({
      redirectTo: '/home'
    });
});

app.run(function ($rootScope) {
  $rootScope.$on('$routeChangeSuccess', function(event, currentRoute) {
    $rootScope.title = currentRoute.title;
  });
});