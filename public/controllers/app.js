'use strict';
/********************************
 Export the controller
 ********************************/
var app = angular.module('myApp', ['ngRoute']);

//route configuration
app.config(function ($routeProvider) {
    
    $routeProvider.
        //root
    when("/", {
            templateUrl: "./views/home.html",
            //controller: 'HomeController'
        }).
        //login page
    when("/account/login", {
            templateUrl: "./views/login.html",
            controller: 'LoginController'
        }).
        //Create Account page
    when('/account/create', {
            templateUrl: 'views/createAccount.html',
            controller: 'CreateAccountController'
        }).
    //Create Account page
    when('/account/logout', {
            templateUrl: 'views/logout.html',
            controller: 'LogOutController'
        }).
        //Diary page
    when('/account/diary', {
        templateUrl: 'views/diary.html',
        controller: 'DiaryController'
        }).
    otherwise({
		redirectTo: '/account/login'
      });
});

//login controller
app.controller('LoginController', function ($scope, $location, $http) {
    
    // Login submission
    $scope.submitLogin = function () {
        // Login request
        $http({
                method: 'POST',
                url: '/account/login',
                data: {
                    'username': $scope.loginForm.username,
                    'password': $scope.loginForm.password
                }
            })
            .success(function (response) {
                $location.path('/account/diary');
            })
            .error(function () {
                alert('Login failed. Check username/password and try again.');
            });
    };
    // Redirect to account creation page
    $scope.createAccount = function () {
        $location.path('/account/create');
    }
});

//create account controller
app.controller('CreateAccountController', function ($scope, $http, $location) {

    $scope.gender = {};
    var gender;
    if ($scope.gender == "male") {
        gender = "male";
    } else {
        gender = "female";
    }
    // Create account
    $scope.submitForm = function () {
        $http({
                method: 'POST',
                url: '/account/create',
                data: {
                    'username': $scope.newUser.username,
                    'password': $scope.newUser.password,
                    'name': $scope.newUser.name,
                    'email': $scope.newUser.email,
                    'age': $scope.newUser.age,
                    'gender': gender,
                    'calories': $scope.newUser.calories
                }
            })
            .success(function (response) {
                alert(response);
                $location.path('/account/login');
            })
            .error(function (response) {
                // When a string is returned
                if (typeof response === 'string') {
                    alert(response);
                }
                // When array is returned
                else if (Array.isArray(response)) {
                    // More than one message returned in the array
                    if (response.length > 1) {
                        var messages = [],
                            allMessages;
                        for (var i = response.length - 1; i >= 0; i--) {
                            messages.push(response[i]['msg']);
                            if (response.length == 0) {
                                allMessages = messages.join(", ");
                                alert(allMessages);
                                console.error(response);
                            }
                        }
                    }
                    // Single message returned in the array
                    else {
                        alert(response[0]['msg']);
                        console.error(response);
                    }
                }
                // When something else is returned
                else {
                    console.error(response);
                    alert("See console for error.");
                }
            });
    };
});

//Diary
app.controller('LogOutController', function ($scope, $location, $http) {
 
});


//Diary
app.controller('DiaryController', function ($scope, $location, $http) {
 
});

