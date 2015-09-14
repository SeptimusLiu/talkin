define([
  'angular',
  'ui.router',
  'ui.bootstrap'
], function (angular) {
  'use strict';
  return angular.module('talkinApp', ['ui.router', 'ui.bootstrap', 'talkin.controllers', 'talkin.states']);
})

/**
 * @ngdoc overview
 * @name talkinApp
 * @description
 * # talkinApp
 *
 * Main module of the application.
 */
// angular
//   .module('talkinApp', [
//     'ngAnimate',
//     'ngCookies',
//     'ngResource',
//     'ngRoute',
//     'ngSanitize',
//     'ngTouch'
//   ])
//   .config(function ($routeProvider) {
//     $routeProvider
//       .when('/', {
//         templateUrl: 'views/main.html',
//         controller: 'MainCtrl',
//         controllerAs: 'main'
//       })
//       .when('/about', {
//         templateUrl: 'views/about.html',
//         controller: 'AboutCtrl',
//         controllerAs: 'about'
//       })
//       .otherwise({
//         redirectTo: '/'
//       });
//   });
