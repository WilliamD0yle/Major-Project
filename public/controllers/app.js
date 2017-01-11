'use strict';
// Export the controller
var app = angular.module('myApp', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "./views/login.html",
            controller: 'LoginController'
        }).
        //Create Account page
        when('/account/create', {
            templateUrl: 'views/createAccount.html'
            //controller: 'CreateAccountController'
        }).
        //Diary page
        when('/account/diary', {
            templateUrl: 'views/diary.html'
            //controller: 'CreateAccountController'
        });
});

app.controller('LoginController', function($scope,$location){
    // Redirect to account creation page
    $scope.createAccount = function(){
        $location.path('/account/create');
    }
});

// Defining wrapper Routes for our API
//app.controller('LoginController', function appCtrl($scope, $http) {
//    $scope.formData = {};
//
//    $http.get('/models')
//        .success(function (data) {
//            $scope.models = data;
//            console.log(data);
//        })
//        .error(function (data) {
//            console.log("Error: " + data);
//        });
//
//    $scope.createModel = function () {
//        $http.post('/models', $scope.formData)
//            .success(function (data) {
//                $scope.formData = {};
//                $scope.models = data;
//                console.log(data);
//            })
//            .error(function (data) {
//                console.log("Error: " + data);
//            });
//    };
//
//    $scope.deleteModel = function (id) {
//        $http.delete('/models/' + id)
//            .success(function (data) {
//                $scope.models = data;
//                console.log(data);
//            })
//            .error(function (data) {
//                console.log("Error: " + data);
//            });
//    };
//});