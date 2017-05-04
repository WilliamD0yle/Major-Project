'use strict';  
/********************************
 Export the controller
 ********************************/
var app = angular.module('myApp', ['ngRoute', 'angularModalService','ui.bootstrap','chart.js']);

//route configuration
app.config(function ($routeProvider) {
    //allows me to change the html for each page of the application in a single page. Keeps it a single page application
    $routeProvider.
    //root
    when("/", {
        templateUrl: "./views/home.html",
        controller: 'HomeController'
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
    //Camera search page
    when('/account/search', {
        templateUrl: 'views/cameraSearch.html',
        controller: 'SearchController'
    }).
    //Account page
    when('/account/', {
        templateUrl: 'views/account.html',
        controller: 'AccountController'
    }).
    //Account textsearch
    when('/account/textsearch', {
        templateUrl: 'views/textSearch.html',
        controller: 'TextSearchController'
    }).
    //Account custom meals page
    when('/account/custom', {
        templateUrl: 'views/custommeal.html',
        controller: 'CustomMealController'
    }).
    //Breakdown of calories consumed page
    when('/account/progress', {
        templateUrl: 'views/progress.html',
        controller: 'ProgressController'
    }).
    //Breakdown page
    when('/test', {
        templateUrl: 'views/cameraSearch.html',
        controller: 'TestController'
    }).
    otherwise({
        redirectTo: '/account/login'
    });
});