'use strict';

/* Controllers */

// =========================================
// MAIN CONTROLLER 
// =========================================
angular.module('app.controllers', []).
  
  controller('MainCtrl', ['$scope', '$http', '$timeout', '$routeParams', function($scope, $http, $timeout, $routeParams) {
      $scope.tests = [];
      // TODO: centralize the getting of tests
      $http.get('/tests/').success(function(data){
      $scope.tests = data;
      $scope.test = $scope.tests[$scope.test_index];
    })
  }]).

  controller('TestCtrl', ['$scope', '$http', '$timeout', '$routeParams', function($scope, $http, $timeout, $routeParams) {
    
    window.scope = $scope;

    console.log($routeParams)

    $scope.voted_for_a = false;
    $scope.voted_for_b = false;

    // TODO: centralize the getting of tests
    $http.get('/tests/' + $routeParams.testKey).success(function(data){
      $scope.test = data[0];
    })


    $scope.vote_for_a = function() {
      $scope.test.voted_for_a = true;
      $scope.test.voted_for_b = false;

      $http.post('/tests/' + $routeParams.testKey + '/vote/', {vote: 'A'}).
        success(function(data) {
          console.log(data)
        })
      ;
    }

    $scope.vote_for_b = function() {
      $scope.test.voted_for_a = false;
      $scope.test.voted_for_b = true;

      $http.post('/tests/' + $routeParams.testKey + '/vote/', {vote: 'B'}).
        success(function(data) {
          console.log(data)
        })
      ;
    }
  }]).
  
  // =========================================
  // ADMIN CONTROLLER 
  // =========================================
  
  controller('AdminCtrl', ['$scope', '$http', function($scope, $http) {
    
    // TODO: centralize the getting of tests
    $scope.tests = []
    $http.get('/tests/').success(function(data){
      $scope.tests = data;
    })


    window.scope = $scope;
    $scope.postData = {};

    $scope.postTest = function() {
      console.log($scope.postData);
      $http.post('/tests/create', $scope.postData).
        success(function(data) {
          console.log(data);
          $scope.tests.push(data);
          $scope.postData = {};

        })
      ;
    }
  
  }])