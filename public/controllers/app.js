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
    
    // used the calculation from - http://www.superskinnyme.com/calculate-tdee.html 
    // gives the new user the suggested amount for their daily calorie consumption
    $scope.calculateCalories = function () {
        //if the user selects female a female only calculation is used
        if(Object.keys($scope.gender).toString() == "female"){
            $scope.calories = Math.ceil(655 + (9.6 * $scope.newUser.weight) + (1.8 * $scope.newUser.height) - (4.7 * $scope.newUser.age));
        }
        else {
            $scope.calories = Math.ceil(66 + (13.7 * $scope.newUser.weight) + (5 * $scope.newUser.height) - (6.8 * $scope.newUser.age));
        }
    };
    
    // Create account
    $scope.submitForm = function () {
        var gender = Object.keys($scope.gender).toString();
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
                'calories': $scope.calories()
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

// Create the factory that share the Fact
app.factory('Meal', function () {
    return {Meal: '',
        update: function (meal) {
            this.Meal = meal;
        }
    };
});

//Text search controller
app.controller('TextSearchController', function ($scope, $location, $http, Meal) {

    var selectedMeal = {meal: Meal.Meal};
     
    //send get request to get the most pupular items for the users
    $http({
        method: 'POST',
        url: '/account/textsearch',
        data: selectedMeal,
    }).
    success(function (response) {
        console.log(response);
    }).
    error(function (response) {
        console.log(response);
    });
    
    
    //hide empty form elements that will be filled with the food information when it has been selected
    $scope.foodContent = false;
    $scope.searchResults = true;
    
    $scope.back = function(){
        $scope.foodContent = false;
        $scope.searchResults = true;  
    };
    

    //each key press triggers the searh function
    $scope.foodTextSearch = function (search) {

        //the if statement makes sure the ng change doesnt trigger a search with an empty string
        if (search) {
            
            $scope.foodContent = false;
            $scope.searchResults = true;
            
            var searchURL = "https://uk.openfoodfacts.org/cgi/search.pl?search_terms=" + search + "&search_simple=1&json=1";

            $http({
                method: 'GET',
                url: searchURL,
                dataType: "json"
            }).
            success(function (response) {
                $scope.results = response.products;
            }).
            error(function (response) {
                console.log(response);
            });
        }
    }
    
    $scope.addFood = function (item) {
        $scope.foodContent = true;
        $scope.searchResults = false;
        $scope.item = item.product_name;
        $scope.carbs = item.nutriments.carbohydrates;
        $scope.fats = item.nutriments.fat;
        $scope.protein = item.nutriments.proteins;
        $scope.serving = item.serving_quantity;
        $scope.cals = Math.ceil(item.nutriments.energy_serving);
        $scope.servingVal = item.serving_quantity;
        $scope.lowestcal = $scope.cals / $scope.serving;
        $scope.totalCals = function () {
            return Math.ceil($scope.lowestcal * $scope.serving);
        };
        $scope.meal = ["Breakfast", "Lunch", "Dinner", "Snacks"];
    };

    $scope.submitDiary = function () {
        var item = $scope.item;
        console.log(item);
        var calories = $scope.totalCals();
        var serving = $scope.serving;
        var carbs = $scope.carbs;
        var fat = $scope.fats;
        var protein = $scope.protein;
        var meal = $scope.selectedMeal.toLowerCase();

        var diaryEntry = {[meal]: [{"name": item,"calories": calories,"servings": serving,"nutrients": {"fat": fat,"carbs": carbs,"protein": protein}}]};
        
        console.log(diaryEntry);
        
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

//Diary controller
app.controller('DiaryController', function ($scope, $location, $http, $route, Meal) {

    $scope.foodContent = false;
    $scope.diary = true;

    $http({
        method: 'GET',
        url: '/account/diary'
    }).
    success(function (response) {
        $scope.diary = response;
        $scope.calculateCals(response);
    }).
    error(function (response) {
        alert(response);
        $location.path('/account/login');
    });

    $scope.foodInfo = function (meal, food) {

        var meal = {
            meal: meal,
            food: food
        };

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

        console.log(response);
        
        $scope.foodContent = true;
        $scope.diary = false;
        var mealid = Object.keys(response)[1];

        $scope.item = response[mealid][0].name;
        $scope.carbs = response[mealid][0].nutrients.carbs;
        $scope.fats = response[mealid][0].nutrients.fat;
        $scope.protein = response[mealid][0].nutrients.protein;
        $scope.cals = response[mealid][0].calories;
        $scope.serving = response[mealid][0].servings;
        $scope.lowestcal = $scope.cals / $scope.serving;
        $scope.totalCals = function () {
            return Math.ceil($scope.lowestcal * $scope.serving);
        };

        $scope.meal = mealid;
    };

    //remove food from the diary page
    $scope.removeFood = function (meal, item) {

        var meal = {meal: meal,food: item};

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
    $scope.updateFood = function (meal, item, serving, totalCals, carbs, fats, protein) {

        var meal = {meal: meal, food: item, serving: serving, totalCals: totalCals(), protein: protein, carbs: carbs, fats: fats};

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
    $scope.calculateCals = function (response) {
        $scope.total = 0;
        $scope.remaining = $scope.total - response.calories;
        for(var key in response){
            for(var x=0;x<response[key].length; x++){
                if(response[key][x].calories){
                    $scope.total = $scope.total + response[key][x].calories;
                }
            }  
        }
        $scope.remaining = response.calories - $scope.total; 
    };
    
    $scope.mealSelected = function(selection){
        Meal.update(selection);
    }
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
            $scope.item = response.product.product_name;
            $scope.carbs = response.product.nutriments.carbohydrates;
            $scope.fats = response.product.nutriments.fat;
            $scope.protein = response.product.nutriments.proteins;
            $scope.cals = Math.ceil(response.product.nutriments.energy_serving);
            $scope.serving = response.product.serving_quantity;;
            $scope.servingVal = $scope.serving;
            $scope.totalCals = function () {
                return ($scope.cals / $scope.serving) * $scope.servingVal;
            };
            $scope.meal = ["Breakfast", "Lunch", "Dinner", "Snacks"];
        }).
        error(function (response) {
            console.log(response);
        });
    };

    $scope.submitDiary = function () {
        var item = $scope.item;
        var calories = $scope.totalCals();
        var serving = $scope.serving;
        var carbs = $scope.carbs;
        var fat = $scope.fats;
        var protein = $scope.protein;
        var meal = $scope.selectedMeal.toLowerCase();
        
        var diaryEntry = {[meal]: [{"name": item,"calories": calories,"servings": serving,"nutrients": {"fat": fat,"carbs": carbs,"protein": protein}}]};

        $http({
            method: 'POST',
            url: '/account/diary',
            data: diaryEntry,
        }).
        success(function (response) {
            $location.path('/account/diary');
        }).
        error(function (err) {
            console.log(err);
        });
    };
});
