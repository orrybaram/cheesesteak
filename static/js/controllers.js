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
      $scope.test = data;
    })


    $scope.vote_for_a = function() {
      if(!$scope.user_has_voted) {

        $http.post('/tests/' + $routeParams.testKey + '/vote/', {vote: 'A'}).
          success(function(data) {
            console.log(data)
            $scope.user_has_voted = true;
            $scope.test = data;
            $scope.test.voted_for_a = true;
            $scope.test.voted_for_b = false;
          })
        ;
      }
    }

    $scope.vote_for_b = function() {
      if(!$scope.user_has_voted) {  
        $http.post('/tests/' + $routeParams.testKey + '/vote/', {vote: 'B'}).
          success(function(data) {
            console.log(data)
            $scope.user_has_voted = true;
            $scope.test = data;
            $scope.test.voted_for_a = false;
            $scope.test.voted_for_b = true;
          })
        ;
      }
    }
  }]).
  
  
  // =========================================
  // USER CONTROLLER 
  // =========================================
  
  controller('UserCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
    
    window.scope = $scope;
    $scope.postData = {};
    $scope.tests = []
    
    // TODO: centralize the getting of tests

    $http.get('/tests/').success(function(data){
      $scope.tests = data;
    })

    $scope.postTest = function() {
      // Edit existing Test
      if ($scope.editing_test) {
        $http.post('/tests/' + $scope.postData.key + '/update/', $scope.postData).
          success(function(data) {
            $scope.postData = {};
            $scope.editing_test = false;
            for (var i = $scope.tests.length - 1; i >= 0; i--) {
              if($scope.tests[i].key === data.key) {
                $scope.tests[i] = data;
              }
            };
          })
        ;

      // Create New Test
      } else {
        $http.post('/tests/create/', $scope.postData).
          success(function(data) {
            $scope.tests.push(data);
            $scope.postData = {};
          })
        ;
      }
    }
    $scope.editTest = function(test) {
      $scope.postData = angular.copy(test);
      $scope.editing_test = true;
      
    }

  
  }]).



  // =========================================
  // ADMIN CONTROLLER 
  // =========================================
  
  controller('AdminCtrl', ['$scope', '$http', function($scope, $http) {
    
    window.scope = $scope;
    $scope.postData = {};
    $scope.tests = []
    
    // TODO: centralize the getting of tests

    $http.get('/tests/').success(function(data){
      $scope.tests = data;
    })

    $scope.postTest = function() {
      // Edit existing Test
      if ($scope.editing_test) {
        $http.post('/tests/' + $scope.postData.key + '/update/', $scope.postData).
          success(function(data) {
            $scope.postData = {};
            $scope.editing_test = false;
            for (var i = $scope.tests.length - 1; i >= 0; i--) {
              if($scope.tests[i].key === data.key) {
                $scope.tests[i] = data;
              }
            };
          })
        ;

      // Create New Test
      } else {
        $http.post('/tests/create/', $scope.postData).
          success(function(data) {
            $scope.tests.push(data);
            $scope.postData = {};
          })
        ;
      }
    }
    $scope.editTest = function(test) {
      $scope.postData = angular.copy(test);
      $scope.editing_test = true;
      
    }

  
  }])