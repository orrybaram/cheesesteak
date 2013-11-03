'use strict';


// Declare app level module which depends on filters, and services
angular.module('app', [
  'ngRoute',
  'app.filters',
  'app.services',
  'app.directives',
  'app.controllers'
]).
config(['$routeProvider', function($routeProvider, $rootScope) {
  	$routeProvider.when('/', {templateUrl: 'partials/home.html', controller: 'MainCtrl'});
  	$routeProvider.when('/tests/:testKey', {templateUrl: 'partials/test.html', controller: 'TestCtrl'});
	$routeProvider.when('/admin', {templateUrl: 'partials/admin.html', controller: 'AdminCtrl'});
	$routeProvider.otherwise({redirectTo: '/'});
}]);

