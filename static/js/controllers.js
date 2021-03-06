'use strict';

/* Controllers */

// =========================================
// MAIN CONTROLLER 
// =========================================
angular.module('app.controllers', []).

controller('MainCtrl', ['$scope', '$http', '$timeout', '$routeParams', function($scope, $http, $timeout, $routeParams) {
    $scope.tests = [];
    // TODO: centralize the getting of tests
    $http.get('/tests/public/').success(function(data){
        $scope.tests = data;
        $scope.test = $scope.tests[$scope.test_index];
    })
}]).

// =========================================
// TEST PAGE CONTROLLER 
// =========================================

controller('TestCtrl', ['$scope', '$http', '$timeout', '$routeParams', function($scope, $http, $timeout, $routeParams) {

    window.scope = $scope;

    $scope.voted_for_a = false;
    $scope.voted_for_b = false;


    // TODO: centralize the getting of tests
    $http.get('/tests/' + $routeParams.testKey).success(function(data){
        $scope.test = data;
    
        $scope.test.votes_a = []
        $scope.test.votes_b = []
        
        // Distribute Votes
        for (var i = 0; i < data.votes.length; i++) {
            var vote = data.votes[i];
            if (vote.voted_for === 'A') {
                $scope.test.votes_a.push(vote);
            } else {
                $scope.test.votes_b.push(vote);
            }
        };
    });


    $scope.vote = function(voted_for) {
        if(!$scope.user_has_voted) {

            $http.post('/tests/' + $routeParams.testKey + '/vote/', {voted_for: voted_for}).
                success(function(data) {
                    $scope.user_has_voted = true;
                    if (data.voted_for === 'A') {
                        $scope.test.votes_a.push(data);
                        $scope.test.voted_for_a = true;
                        $scope.test.voted_for_b = false;
                    } else {
                        $scope.test.votes_b.push(data);
                        $scope.test.voted_for_a = false;
                        $scope.test.voted_for_b = true;
                    }
                })
            ;
        }
    }
}]).


// =========================================
// USER PAGE CONTROLLER 
// =========================================
  
controller('UserCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {

    window.scope = $scope;
    $scope.post_test_button_text = "Create Test";
    $scope.postData = {};
    $scope.postData.is_public = true;
    $scope.tests = []
    
    // TODO: centralize the getting of tests

    $http.get('/tests/').success(function(data){
        $scope.tests = data;

        // Distribute Votes
        for (var i = 0; i < $scope.tests.length; i++) {
            var test = $scope.tests[i]
            
            $scope.tests[i].votes_a = [];
            $scope.tests[i].votes_b = [];
            if (test.votes) {
                for (var j = 0; j < test.votes.length; j++) {
                    var vote = test.votes[j];
                    if (vote.voted_for === 'A') {
                        $scope.tests[i].votes_a.push(vote);
                    } else {
                        $scope.tests[i].votes_b.push(vote);
                    }
                };
            }
            
        };

    })

    $scope.postTest = function() {
        
        // Edit existing Test
        if ($scope.editing_test) {
            $scope.post_test_button_text = "Updating...";
            $http.post('/tests/' + $scope.postData.key + '/update/', $scope.postData).
                success(function(data) {
                    $scope.postData = {};
                    $scope.postData.is_public = true;
                    $scope.editing_test = false;
                    $scope.post_test_button_text = "Create Test";
                    for (var i = $scope.tests.length - 1; i >= 0; i--) {
                        if($scope.tests[i].key === data.key) {
                            $scope.tests[i] = data;
                        }
                    };
                })
            ;
        // Create New Test
        } else {
            $scope.post_test_button_text = "Adding...";
            $http.post('/tests/create/', $scope.postData).
                success(function(data) {
                    $scope.tests.push(data);
                    $scope.postData = {};
                    $scope.postData.is_public = true;
                    $scope.post_test_button_text = "Create Test";
                })
            ;
        }
    }
    $scope.editTest = function(test) {
        $scope.postData = angular.copy(test);
        $scope.editing_test = true;
        $scope.post_test_button_text = "Update Test";
    }

    $scope.deleteTest = function(test) {
        var confirm = window.confirm("Are you sure you wanna delete this?");
        if (confirm) {
            $http.post('/tests/' + test.key + '/delete/').
                success(function(data) {
                    console.log(data)
                })
            ;
            for (var i = 0; i < $scope.tests.length; i++) {
                var _test = $scope.tests[i];
                if(_test.key === test.key) {
                    $scope.tests.splice(i,1);
                    break;
                }
            };
        }
    }

}]).



// =========================================
// ADMIN CONTROLLER 
// =========================================
  
controller('AdminCtrl', ['$scope', '$http', function($scope, $http) {

    window.scope = $scope;
    $scope.postData = {};
    $scope.tests = [];
    
    // TODO: centralize the getting of tests

    $http.get('/tests/').success(function(data){
        $scope.tests = data.tests;
        $scope.votes = data.votes;
    });

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