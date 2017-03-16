'use strict';
/********************************
 Export the controller
 ********************************/
var app = angular.module('myApp', ['ngRoute']);

//route configuration
app.config(function ($routeProvider) {
    //allows me to change the html for each page of the application in a single page. Keeps it a single page application
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
        //Camera searxch page
    when('/account/search', {
            templateUrl: 'views/cameraSearch.html',
            controller: 'SearchController'
        }).
        //Account page
    when('/account/', {
            templateUrl: 'views/account.html',
            controller: 'AccountController'
        }).
        //Account page
    when('/account/textsearch', {
        templateUrl: 'views/textSearch.html',
        controller: 'TextSearchController'
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
        }).
        success(function (response) {
            $location.path('/account/diary');
        }).
        error(function (err) {
            alert(err + 'Login failed. Check username/password and try again.');
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
    console.log($scope.gender);
    var gender;
    if ($scope.gender == "female") {
        gender = "female";
    } else {
        gender = "male";
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
        }).
        success(function (response) {
            alert(response);
            $location.path('/account/login');
        }).
        error(function (response) {
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

//Logout controller
app.controller('LogOutController', function ($scope, $location, $http) {

    // Logout function
    $http({
        method: 'GET',
        url: '/account/logout'
    }).
    success(function (response) {
        console.log(response);
        $location.path('/');
    }).
    error(function (response) {
        console.log(response);
        $location.path('/account/login');
    });

});

//Account controller
app.controller('AccountController', function ($scope, $location, $http) {

});


//Text search controller
app.controller('TextSearchController', function ($scope, $location, $http) {
    //search variable value
    $scope.search;
    //each key press triggers the searh function
    $scope.foodTextSearch = function (search) {
        
        //the if statement makes sure the ng change doesnt trigger a search with an empty string
        if (search) {
            var searchURL = "https://uk.openfoodfacts.org/cgi/search.pl?search_terms=" + search + "&search_simple=1&json=1";

            $http({
                method: 'GET',
                url: searchURL,
                dataType: "json"
            }).
            success(function (response) {
                console.log(response);
                $scope.results = response.products;
            }).
            error(function (response) {
                console.log(response);
            });
        }
    }
});

//Diary controller
app.controller('DiaryController', function ($scope, $location, $http, $route) {
 
    $scope.foodContent = false;
    $scope.diary = true;
    
    $http({
        method: 'GET',
        url: '/account/diary'
    }).
    success(function (response) {
        $scope.diary = response;
    }).
    error(function (response) {
        alert(response);
        $location.path('/account/login');
    });
    
    $scope.foodInfo = function(meal,food){
        
        var meal = {meal:meal,food:food};
        
        $http({
            method: 'POST',
            url: '/account/food/info',
            data: meal
        }).
        success(function (response) {
            $scope.fillInFoodInfo(response);
        }).
        error(function (response) {
            console.log(response);
        });
    };
    
    $scope.fillInFoodInfo = function (response) {
            
        
        $scope.foodContent = true;
        $scope.diary = false;
        var mealid = Object.keys(response)[1];
        
        $scope.item = response[mealid][0].name;
        $scope.carbs = response[mealid][0].nutrients.carbs;
        $scope.fats = response[mealid][0].nutrients.fat;
        $scope.protein = response[mealid][0].nutrients.protein;
        $scope.cals = response[mealid][0].serving_size;
        $scope.serving = response[mealid][0].servings;
        $scope.totalCals = function () {
            $scope.result = $scope.cals * $scope.serving;
            return $scope.cals * $scope.serving;
        };
        $scope.meal = Object.keys(response)[1];
        
        $scope.meal = mealid;
    };
    
    //remove food from the diary page
    $scope.removeFood = function(meal,item){
        
        var meal = {meal:meal, food:item};
        
        $http({
            method: 'POST',
            url: '/account/food/delete',
            data: meal
        }).
        success(function (response) {
            console.log(response);
            $route.reload();
        }).
        error(function (response) {
            console.log(response);
        });
    };
    
    //update the item  and send the details to the server
    $scope.updateFood = function (meal,item, serving, totalCals, carbs, fats, protein) {
        
        var meal = {meal:meal, food:item, serving: serving, totalCals: totalCals(), protein: protein, carbs: carbs, fats: fats};

        $http({
            method: 'POST',
            url: '/account/food/update',
            data: meal
        }).
        success(function (response) {
            console.log(response);
            $route.reload();
        }).
        error(function (response) {
            console.log(response);
        });
        
    };
    
    //calculate all the calories on the diary page
    $scope.calculateCals = function(){
        
    };
    
});

//Search controller
app.controller('SearchController', function ($scope, $location, $http, $route) {
    $scope.startQR = function () {
        var resultCollector = Quagga.ResultCollector.create({
            capture: true,
            capacity: 20,
            filter: function (codeResult) {
                // only store results which match this constraint
                // e.g.: codeResult
                return true;
            }
        });
        var App = {
            init: function () {
                var self = this;

                Quagga.init(this.state, function (err) {
                    if (err) {
                        return self.handleError(err);
                    }
                    Quagga.registerResultCollector(resultCollector);
                    //Start the camera
                    Quagga.start();
                });
            },
            handleError: function (err) {
                //log the error
                console.log(err);
            },
            setState: function (path, value) {
                var self = this;

                if (typeof self._accessByPath(self.inputMapper, path) === "function") {
                    value = self._accessByPath(self.inputMapper, path)(value);
                }

                self._accessByPath(self.state, path, value);
                //console log the settigs
                console.log(JSON.stringify(self.state));
                App.detachListeners();
                //Stop the camera
                Quagga.stop();
                //Start the camera
                App.init();
            },
            state: {
                inputStream: {
                    type: "LiveStream",
                    constraints: {
                        //rare facing camera if availible 
                        facingMode: "environment"
                    },
                    area: { // defines rectangle of the detection/localization area
                        top: "0%", // top offset
                        right: "0%", // right offset
                        left: "0%", // left offset
                        bottom: "0%" // bottom offset
                    },
                    singleChannel: false // true: only the red color-channel is read
                },
                locator: {
                    patchSize: "medium",
                    halfSample: true
                },
                numOfWorkers: 4,
                decoder: {
                    readers: [{ //type of barcode then will be read - ean is used for food and beverage products
                        format: "ean_reader",
                        config: {
                            //supplements: ['ean_8_reader']
                        }
                }]
                },
                locate: true
            },
            lastResult: null
        };
        App.init();
        //adds helper details to video on canvas to where its looking for the barcode
        Quagga.onProcessed(function (result) {
            var drawingCtx = Quagga.canvas.ctx.overlay,
                drawingCanvas = Quagga.canvas.dom.overlay;

            if (result) {
                if (result.boxes) {
                    drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                    result.boxes.filter(function (box) {
                        return box !== result.box;
                    }).forEach(function (box) {
                        Quagga.ImageDebug.drawPath(box, {
                            x: 0,
                            y: 1
                        }, drawingCtx, {
                            color: "green",
                            lineWidth: 2
                        });
                    });
                }

                if (result.box) {
                    Quagga.ImageDebug.drawPath(result.box, {
                        x: 0,
                        y: 1
                    }, drawingCtx, {
                        color: "#00F",
                        lineWidth: 2
                    });
                }

                if (result.codeResult && result.codeResult.code) {
                    Quagga.ImageDebug.drawPath(result.line, {
                        x: 'x',
                        y: 'y'
                    }, drawingCtx, {
                        color: 'red',
                        lineWidth: 3
                    });
                }
            }
        });

        Quagga.onDetected(function (result) {
            Quagga.stop();
            var code = result.codeResult.code;
            jQuery(".video").hide();
            jQuery(".enteredBarcode").html(code);
            $scope.barcodeSearch(code);
            Quagga.stop();
        });
    };
    
    //load the load function
    $scope.startQR();

    $scope.barcodeSearch = function (barcode) {
    
        var searchURL = "https://world.openfoodfacts.org/api/v0/product/" + barcode + ".json";
        $http({
            method: 'GET',
            url: searchURL,
        }).
        success(function (response) {
            console.log(response.product.nutriments);
            $scope.item = response.product.product_name;
            $scope.carbs = response.product.nutriments.carbohydrates;
            $scope.fats = response.product.nutriments.fat;
            $scope.protein = response.product.nutriments.proteins;
            $scope.cals = Math.ceil(response.product.nutriments.energy_serving)/4;
            $scope.serving = response.product.serving_size;
            $scope.servingVal = 1;
            $scope.totalCals = function(){
                $scope.result = $scope.cals * $scope.servingVal;
                return $scope.cals * $scope.servingVal;
            };
            $scope.meal = ["Breakfast","Lunch","Dinner","Snacks"];
        }).
        error(function (response) {
            console.log(response);
        });
    };
    
    $scope.submitDiary = function () {
        var item = $scope.item;
        var calories = $scope.result;
        var serving_size = $scope.cals;
        var serving = $scope.servingVal;
        var carbs = $scope.carbs;
        var fat = $scope.fats;
        var protein = $scope.protein;
        
        if($scope.selectedMeal == "Breakfast"){
            var diaryEntry = {breakfast:[{"name":item,"calories":calories, "servings":serving, serving_size: serving_size, "nutrients":{"fat":fat, "carbs":carbs,"protein":protein}}]};
        }
        else if($scope.selectedMeal == "Lunch"){
            var diaryEntry = {lunch:[{"name":item,"calories":calories, "servings":serving, serving_size: serving_size, "nutrients":{"fat":fat, "carbs":carbs,"protein":protein}}]};
        }
        else if($scope.selectedMeal == "Dinner"){
            var diaryEntry = {dinner:[{"name":item,"calories":calories, "servings":serving, serving_size: serving_size, "nutrients":{"fat":fat, "carbs":carbs,"protein":protein}}]};
        }
        else{
            var diaryEntry = {snacks:[{"name":item,"calories":calories, "servings":serving, serving_size: serving_size, "nutrients":{"fat":fat, "carbs":carbs,"protein":protein}}]};
        }
        
        $http({
            method: 'POST',
            url: '/account/diary',
            data: diaryEntry,
        }).
        success(function (response) {
            console.log(response);
            $location.path('/account/diary');
        }).
        error(function (err) {
            console.log(err);
        });
    };
});