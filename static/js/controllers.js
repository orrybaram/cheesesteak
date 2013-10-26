'use strict';

/* Controllers */

angular.module('app.controllers', []).
  controller('MainCtrl', ['$scope', '$http', function($scope, $http) {
    
    $scope.tests = [];
    
    $http.get('/tests/').success(function(data){
      $scope.tests = data;
    })

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