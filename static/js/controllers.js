'use strict';

/* Controllers */

angular.module('app.controllers', []).
  controller('MainCtrl', ['$scope', '$http', function($scope, $http) {

  	console.log('hi main')

    $http.get('/tests/').success(function(data){
      console.log(data)
    })


  }]).

  controller('AdminCtrl', ['$scope', '$http', function($scope, $http) {

    console.log('hi admin')




  }])