'use strict';


// Declare app level module which depends on filters, and services
angular.module('app', [
  'ngRoute',
  'ngTouch',
  'app.filters',
  'app.services',
  'app.directives',
  'app.controllers'
]).
config(['$routeProvider', function($routeProvider, $rootScope) {
  	$routeProvider.when('/', {templateUrl: 'partials/home.html', controller: 'MainCtrl'});
  	$routeProvider.when('/tests/:testKey', {templateUrl: 'partials/test.html', controller: 'TestCtrl'});
  	$routeProvider.when('/user/:userId', {templateUrl: 'partials/user.html', controller: 'UserCtrl'});
	$routeProvider.when('/admin', {templateUrl: 'partials/admin.html', controller: 'AdminCtrl'});
	$routeProvider.otherwise({redirectTo: '/'});

}]);

$(document).foundation();
