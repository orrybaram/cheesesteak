'use strict';

/* Controllers */

angular.module('app.controllers', []).
  controller('MainCtrl', ['$scope', '$http', function($scope, $http) {
    
    $scope.tests = [];
    $scope.voted_for_a = false;
    $scope.voted_for_b = false;
    
    $http.get('/tests/').success(function(data){
      $scope.tests = data;
    })

    $scope.vote_for_a = function() {
      $scope.voted_for_a = true;
      $scope.voted_for_b = false;
    }

    $scope.vote_for_b = function() {
      $scope.voted_for_a = false;
      $scope.voted_for_b = true;
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