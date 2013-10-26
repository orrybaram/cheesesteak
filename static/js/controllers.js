'use strict';

/* Controllers */

angular.module('app.controllers', []).
  controller('MainCtrl', ['$scope', '$http', function($scope, $http) {
    
    window.scope = $scope;  

    $scope.tests = [];
    $scope.voted_for_a = false;
    $scope.voted_for_b = false;
    $scope.test_index = 0;

    
    $http.get('/tests/').success(function(data){
      $scope.tests = data;
      $scope.test = $scope.tests[$scope.test_index];
    })


    $scope.vote_for_a = function() {
      $scope.test.voted_for_a = true;
      $scope.test.voted_for_b = false;
    }

    $scope.vote_for_b = function() {
      $scope.test.voted_for_a = false;
      $scope.test.voted_for_b = true;
    }

    $scope.next_test = function() {
      console.log($scope.test_index)
      if ($scope.test_index !== $scope.tests.length - 1) {
        $scope.test_index += 1
      } else {
        $scope.test_index = 0;
      }
      
      $scope.test = $scope.tests[$scope.test_index];
    }

    $scope.prev_test = function() {
      console.log($scope.test_index)
      if ($scope.test_index > 0) {
        $scope.test_index -= 1
      } else {
        $scope.test_index = $scope.tests.length - 1;
      }

      $scope.test = $scope.tests[$scope.test_index];
    }

  }]).

  controller('AdminCtrl', ['$scope', '$http', function($scope, $http) {
    
    $scope.postData = {};

    $scope.postTest = function() {
      $http.post('/tests/', $scope.postData).
        success(function(data) {
          console.log(data);
          $scope.postData = {};
        })
    }
  
  }])