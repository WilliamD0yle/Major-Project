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
//Account controller
app.controller('AccountController', function ($scope, $location, $http, Meal) {
    
    // get user details
    $http({
        method: 'GET',
        url: '/account',
    }).
    success(function (response) {
        if(!response){
           $location.path('/account/login'); 
        }
        $scope.user = response;
        $scope.user.calories = response.calories;
        if($scope.user.gender == "male"){
            $scope.male = true;
        }
        else{
            $scope.female = true;
        }
        
    }).
    error(function (response) {
        console.log(response);
        $location.path('/account/login');
    });
    
    // used the calculation from - http://www.superskinnyme.com/calculate-tdee.html 
    // gives the new user the suggested amount for their daily calorie consumption
    $scope.calculateCalories = function () {

        //if the user selects female a female only calculation is used
        if($scope.female == true){
            $scope.user.calories = Math.ceil(655 + (9.6 * $scope.user.weight) + (1.8 * $scope.user.height) - (4.7 * $scope.user.age));
        }
        else {
            $scope.user.calories = Math.ceil(66 + (13.7 * $scope.user.weight) + (5 * $scope.user.height) - (6.8 * $scope.user.age));
        }
    };
    
    //when the form is submitted the function is called
    $scope.submitForm = function(){
        //if the user selected male assign the value male
        if($scope.male == true){
            $scope.gender = "male";
        }//if the user selected  female assign the value female
        else{
            $scope.gender = "female";
        }
        //use the HTTP request to post the information to the server
        $http({
            method: 'POST',
            url: '/account/update',
            data: {
                'username': $scope.user.username,
                'password': $scope.password,
                'name': $scope.user.name,
                'email': $scope.user.email,
                'age': $scope.user.age,
                'height': $scope.user.height,
                'weight': $scope.user.weight,
                'gender': $scope.gender,
                'calories': $scope.user.calories
            }
        }).//if its a success the user is redirected to the diary page
        success(function (response) {
            alert(response);
            $location.path('/account/diary');
        }).
        error(function (response) {
            console.log(response);
        });
    };
});
// add food modal controller
app.controller('AddFoodController', function ($scope, $http, $route, $location, meal, food) {
    // check if the food being added is an existing item or not
    // this is done as this format of the json is slightly different
    if(food[meal]){
        $scope.item = food[meal].name;
        $scope.brand = food[meal].brands;
        $scope.carbs = food[meal].nutrients.carbs;
        $scope.fats = food[meal].nutrients.fat;
        $scope.protein = food[meal].nutrients.protein;
        $scope.cals = food[meal].calories;
        $scope.serving = Number(food[meal].servings);
        $scope.image = food[meal].image;
    }
    else{
        $scope.item = food.product_name;
        $scope.brand = food.brands;
        $scope.carbs = food.nutriments.carbohydrates;
        $scope.fats = food.nutriments.fat;
        $scope.protein = food.nutriments.proteins;
        $scope.serving = food.serving_quantity;
        $scope.cals = Math.ceil(food.nutriments.energy_serving);
        $scope.image = food.image_front_small_url;
    } 
    //work out the specific values for each nutrient by the users selected serving
    $scope.lowestcal = $scope.cals / $scope.serving;
    $scope.lowestcarbs = $scope.carbs / $scope.serving;
    $scope.lowestfats = $scope.fats / $scope.serving;
    $scope.lowestprotein = $scope.protein / $scope.serving;
    $scope.totalCals = function () {
        
        if(!$scope.lowestcal){
            console.log("not working");
            return "No calorie information availible.";
        }
        else{
            return Math.ceil($scope.lowestcal * $scope.serving);
        }
    };
    //work out the specific values for each nutrient by the users selected serving
    $scope.totalCarbs = function () {
        if(!$scope.lowestcal){
            console.log("not working");
            return "No carb information availible.";
        }
        else{
            return Math.ceil($scope.lowestcarbs * $scope.serving);
        }
    };
    //work out the specific values for each nutrient by the users selected serving
    $scope.totalFats = function () {
        if(!$scope.lowestcal){
            console.log("not working");
            return "No fat information availible.";
        }
        else{
            return Math.ceil($scope.lowestfats * $scope.serving);
        }
    };
    //work out the specific values for each nutrient by the users selected serving
    $scope.totalProtein = function () {
        if(!$scope.lowestcal){
            console.log("not working");
            return "No protein information availible.";
        }
        else{
            return Math.ceil($scope.lowestprotein * $scope.serving);
        }
    };
    
    //the meal type selected
    $scope.meal = meal;
    
    //add cals sends the selected data to the server to then be added to the users food data for that day in the database
    $scope.addCals = function () {
        //create an object holding all the information
        var diaryEntry = {[meal]: [{"name": $scope.item,"brand": $scope.brand,"image": $scope.image,"calories": $scope.totalCals(),"servings": $scope.serving,"nutrients": {"fat": $scope.totalFats(),"carbs": $scope.totalCarbs(),"protein": $scope.totalProtein()}}]};
        console.log($scope.totalCals());
        if(!$scope.lowestcal){
            alert("Cannot add item with incomplete details, please select another item or use the quick add feature.");
        }
        else{
            //use a post method to send the data to the server
            $http({
                method: 'POST',
                url: '/account/diary',
                data: diaryEntry
            }).
            success(function (response) {
                angular.element('body').removeClass('modal-open');
                angular.element('div').removeClass('modal-backdrop');
                $location.path('/account/diary');
            }).
            error(function (err) {
                console.log(err);
            });
        }
        
    };
    
});
//Search controller
app.controller('SearchController', function ($scope, $location, $http, $route, Meal, ModalService) {
    //get the chosen meal name
    var selectedMeal = {meal: Meal.Meal};
    $scope.meal = selectedMeal.meal;
    //redirect if the user isnt logged in
    if(!$scope.meal){
       $location.path('/account/diary');
    }
    //start the camera on desktop
    var App = {
        init: function () {
            var self = this;

            Quagga.init(this.state, function (err) {
                if (err) {
                    return self.handleError(err);
                }
                //Start the camera
                Quagga.start();
            });
        },
        handleError: function (err) {
            //log the error
            console.log(err);
        },
        initCameraSelection: function(){
        var streamLabel = Quagga.CameraAccess.getActiveStreamLabel();

        return Quagga.CameraAccess.enumerateVideoDevices().then(function(devices) {
            function pruneText(text) {
                return text.length > 30 ? text.substr(0, 30) : text;
                }
                var $deviceSelection = document.getElementById("deviceSelection");
                while ($deviceSelection.firstChild) {
                    $deviceSelection.removeChild($deviceSelection.firstChild);
                }
                devices.forEach(function(device) {
                    var $option = document.createElement("option");
                    $option.value = device.deviceId || device.id;
                    $option.appendChild(document.createTextNode(pruneText(device.label || device.deviceId || device.id)));
                    $option.selected = streamLabel === device.label;
                    $deviceSelection.appendChild($option);
                });
            });
        },
        state: {
            inputStream: {
                name : "Live",
                type : "LiveStream",
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
        }
    };
    //start the camera
    App.init();
	// Create the QuaggaJS config object for the live stream
    var liveStreamConfig = {
			inputStream: {
				type : "LiveStream",
				constraints: {
					facingMode: "environment" // or "user" for the front camera
				}
			},
			locator: {
				patchSize: "medium",
				halfSample: true
			},
			numOfWorkers: (navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 4),
			decoder: {
				"readers":[
					{"format":"ean_reader","config":{}}
				]
			},
			locate: true,
		};
    //config settings
	var fileConfig = $.extend({}, liveStreamConfig,{inputStream: {size: 800}});
	
	// Once a barcode had been read successfully, stop quagga
	Quagga.onDetected(function(result) {  
		if (result.codeResult.code){
            Quagga.stop();	
            $scope.barcodeSearch(result.codeResult.code);		
		}
	});
	// file input
	$(".container input:file").on("change", function(e) {
        Quagga.stop();	
		if (e.target.files && e.target.files.length) {
			Quagga.decodeSingle($.extend({}, fileConfig, {src: URL.createObjectURL(e.target.files[0])}), function(result) {});
		}
	});
    //when as user scans a barcode it calls the search for the product using the barcode
    $scope.barcodeSearch = function (barcode) {
        //stop the camera 
        Quagga.stop();	
        var search = true;
        var searchURL = "https://world.openfoodfacts.org/api/v0/product/" + barcode + ".json";
        $scope.loading = true;
        //if search is true
        if(search){
            //make a request with method of get
            $http({
            method: 'GET',
            url: searchURL,
            }).success(function (response) {
                //stop the loading animation
                $scope.loading = false;
                search = false;
                //if the product is not found
                if(response.product.complete == 0){
                    alert("Product not found!");  
                    $location.path('/account/diary');
                   }else{
                       //show the information to the user in the modal to add to the diary and database
                    $scope.foodInformation(response.product);  
                   }
            }).error(function(response) {
                console.log(response);
            });
        } 
    };
    //calls the modal to add the food to the database
    $scope.foodInformation = function (food) {
        ModalService.showModal({
            templateUrl: './views/addfood.html',
            controller: 'AddFoodController',
            inputs: {
                food: food,
                meal: selectedMeal.meal
            }
        }).then(function (modal) {
            modal.element.modal();
        });
    };

});
//create account controller
app.controller('CreateAccountController', function ($scope, $http, $location) {
    $("#sidebar-toggle").hide();
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
                'calories': $scope.calories
            }
        }).
        success(function (response) {
            alert(response);
            $location.path('/');
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
//Custome meal controller
app.controller('CustomMealController', function ($scope, $http, $route, $location, $timeout) {
    
    // get food that could be used to create a custom meal
    $http({
        method: 'GET',
        url: '/account/diary'
    }).
    success(function (response) {
        $scope.diary = response;
    }).
    error(function (response) {
        $location.path('/account/diary');
    });
    
    // get the current custom meals so the user can delete them if they so wish
    //send get request to get the custom items for the users
    $http({
        method: 'GET',
        url: '/account/custom',
    }).
    success(function (response) {
        $scope.keys = [];
        $scope.customMeals = response[0].customs;
        for(var i = 0;i<$scope.customMeals.length;i++){
            $scope.keys.push(Object.keys($scope.customMeals[i]));
        }
    }).
    error(function (response) {
        console.log(response);
    });
    
    $scope.toggleClass = function (event){
        $(event.target).toggleClass('added');
    };
    
    //empty array that will hold the selected items
    $scope.selectedFood = [];
    
    //function that adds the selected items to the array
    $scope.addToSelected = function (meal, food) {
        $scope.selectedFood.push({meal,food});
    };    
     
    //function that fetches all the data for the meal
    $scope.fetchFoodData = function () {
            //empty array that will be used to format the returning items from the database for the custom meal
            var mealItems = [];
            if($scope.selectedFood != ""){
                //loop over the selected meal names to get the specific info for each item
                for (var i = 0; i < $scope.selectedFood.length; i++) {
                    var mealtype = $scope.selectedFood[i].meal;
                    $http({
                        method: 'POST',
                        url: '/account/food/info',
                        data: $scope.selectedFood[i]
                    }).success(function (response) {
                        mealItems.push(response[mealtype]);  
                    }).error(function (response) {
                        console.log(response);
                    });
                };
                $timeout(function () {
                    $scope.sendFoodData(mealItems);
                }, 250);
        }else{
            alert("Please add food items to create a custom meal!");
        }
    }
    //function that pushes the data to the server to be removed
    $scope.removeCustom = function (meal) {
        //sends the json data to the server
        $http({
            method: 'POST',
            url: '/account/food/deletecustom',
            data: meal
        }).success(function (response) {
            console.log(response);
            alert("Meal Deleted");
            $route.reload();
        }).error(function (response) {
            console.log(response);
        });
    };  
    
    //function that pushes the data to the server
    $scope.sendFoodData = function (items) {
        //sends the json data to the server
        $http({
            method: 'POST',
            url: '/account/food/custom',
            data: {[$scope.name]:items}
        }).success(function (response) {
            alert($scope.name);
            $location.path('/account/diary');
        }).error(function (response) {
            console.log(response);
        });
    };
});
//Diary controller
app.controller('DiaryController', function ($scope, $location, $http, $route, Meal, ModalService) {
    
    //get request that retrieves the users dairy for today
    $http({
        method: 'GET',
        url: '/account/diary'
    }).//assign the entries to the diary variable
    success(function (response) {
        console.log(response.breakfast);
        $scope.diary = response;
        //function that works out the total amount of calories
        $scope.calculateCals(response);
    }).
    error(function (response) {
        $location.path('/');
    });

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
        //work out the remaining calories
        $scope.remaining = response.calories - $scope.total;        
    };
    //set the meal type for the factory
    $scope.mealSelected = function(selection){
        Meal.update(selection);
    }
    //calls a function 
    $scope.foodInformation = function (chosenmeal, food) {
        var meal = {meal: chosenmeal,food: food};
        //http post request
        $http({
            method: 'POST',
            url: '/account/food/info',
            data: meal
        }).success(function (response) {
            //when successful call the modal
            ModalService.showModal({
                templateUrl: './views/foodcontent.html',
                controller: "FoodContentController",
                inputs: {
                    chosenMeal: chosenmeal,
                    food: response
                }
            }).then(function (modal) {
                modal.element.modal();
            });
        }).error(function (response) {
            console.log(response);
        });

    };
    //quick add calories 
    $scope.quickAdd = function (meal) {
        console.log(meal);
        ModalService.showModal({
            templateUrl: './views/quickAddCals.html',
            controller: "QuickAddController",
            inputs: {
                chosenMeal: meal
            }
        }).then(function (modal) {
            modal.element.modal();
        });
    };
});
app.controller('FoodContentController', function ($scope, $http, $route, chosenMeal, food) {
    //collect the details from the food item
    $scope.chosenMeal = chosenMeal;
    $scope.id = food[chosenMeal][0].id;
    $scope.item = food[chosenMeal][0].name;
    $scope.carbs = food[chosenMeal][0].nutrients.carbs;
    $scope.fats = food[chosenMeal][0].nutrients.fat;
    $scope.protein = food[chosenMeal][0].nutrients.protein;
    $scope.cals = food[chosenMeal][0].calories;
    $scope.serving = Number(food[chosenMeal][0].servings);
    $scope.lowestcal = $scope.cals / $scope.serving;
    $scope.lowestcarbs = $scope.carbs / $scope.serving;
    $scope.lowestfats = $scope.fats / $scope.serving;
    $scope.lowestprotein = $scope.protein / $scope.serving;
    //work out the total cals
    $scope.totalCals = function () {
        return Math.ceil($scope.lowestcal * $scope.serving);
    };
    //work out the total carbs
    $scope.totalCarbs = function () {
        return Math.ceil($scope.lowestcarbs * $scope.serving);
    };
    //work out the total fats
    $scope.totalFats = function () {
        return Math.ceil($scope.lowestfats * $scope.serving);

    };
    //work out the total protein
    $scope.totalProtein = function () {
        return Math.ceil($scope.lowestprotein * $scope.serving);
    };
    
    //update the item  and send the details to the server
    $scope.updateFood = function (item, serving, totalCals, carbs, fats, protein) {
        //format the object to add the database
        var meal = {meal: $scope.chosenMeal, food: item,id: $scope.id, serving: serving, totalCals: totalCals(), protein: protein, carbs: carbs, fats: fats};
        console.log(meal);
        $http({
            method: 'POST',
            url: '/account/food/update',
            data: meal
        }).
        success(function (response) {
//            $('.modal, .modal-backdrop, .modal-open').removeClass();
            console.log(response);
            $route.reload();
        }).
        error(function (response) {
            console.log(response);
        });
    };
    
    //remove food from the diary page
    $scope.removeFood = function () {

        var meal = {meal: $scope.chosenMeal, id: $scope.id};

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
});
//Home controller
app.controller('HomeController', function ($scope, $location, $http) {
    	
    $("#sidebar-toggle").hide();
    var screenWidth = $(window).width();
    //if the width is greater than 700
    if (screenWidth > 700){
        $scope.login = true;    
        $scope.loginPage = false;    
    }else{
        $scope.login = false;
        $scope.loginPage = true; 
    }
    
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
            $("#sidebar-toggle").show();
            $location.path('/account/diary');
        }).
        error(function (err) {
            alert(err + 'Login failed. Check username/password and try again.');
        });
    };
    
});
//login controller
app.controller('LoginController', function ($scope, $location, $http) {
    $("#sidebar-toggle").hide();
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
            $("#sidebar-toggle").show();
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
//Logout controller
app.controller('LogOutController', function ($scope, $location, $http, Meal) {
    $("#sidebar-toggle").hide();
    // Logout function
    $http({
        method: 'GET',
        url: '/account/logout',
        xhrFields: {
            withCredentials: true
        }
    }).
    success(function (response) {
        console.log(response);
    }).
    error(function (response) {
        console.log(response);
        $location.path('/account/login');
    });

});
// Create the factory that share the meal type to any controller
app.factory('Meal', function () {
    return {Meal: '',
        update: function (meal) {
            this.Meal = meal;
        }
    };
});
//progress controller
app.controller('ProgressController', function ($scope, $location, $http, $filter) {
    
    //get the diary information from the server
    $http({
        method: 'GET',
        url: '/account/diary'
    }).
    success(function (response) {
        //assign target the value of the users calories
        $scope.target = response.calories;
        $scope.progress();
    }).//if theres an error redirect to the diary
    error(function (response) {
        $location.path('/');
    });
    
    // get user info
    $scope.progress = function(){
        //get the full calorie information for this user from the server
        $http({
            method: 'GET',
            url: '/account/progress',
        }).
        success(function (response) {
            // creating arrays to hold graph data
            $scope.cals = [];
            $scope.targetCals = [];
            $scope.monthlyTargetCals = [];
            $scope.dailyTargetCals = [];
            $scope.dates = [];
            $scope.monthlyDates = [];
            $scope.monthlyCals = [];
            $scope.dailyDates = [];
            $scope.dailyCals = [];
            
            //pattern to decode the date from the database
            var pattern = /(\d{4})(\d{2})(\d{2})/;
            var monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
            
            var d = new Date();
            var thisMonth = monthNames[d.getMonth()];
            var today = d.getDate();
            Date.prototype.yyyymmdd = function() {
              var mm = this.getMonth() + 1;
              var dd = this.getDate();

              return [this.getFullYear(),
                      (mm>9 ? '' : '0') + mm,
                      (dd>9 ? '' : '0') + dd
                     ].join('');
            };

            var currentDate = new Date();

            //loop over the information to sort into the correct arrays
            for(var i=0;i<response.length;i++){
                
                var date = response[i].date + 100;
                // all entris are shown for long term overview
                $scope.cals.push(response[i].calories);
                $scope.dates.push($filter('date')(new Date(date.toString().replace(pattern, '$1-$2-$3'))));
                $scope.targetCals.push($scope.target);
                
                //if its in this month or the previous month
                if(response[i].date + 100 >= currentDate.yyyymmdd() - 100){
                    $scope.monthlyDates.push($filter('date')(new Date(date.toString().replace(pattern, '$1-$2-$3'))));
                    $scope.monthlyCals.push(response[i].calories);
                    $scope.monthlyTargetCals.push($scope.target);
                }
                
                //if the entry is within the last 7 days
                if(response[i].date + 100 > currentDate.yyyymmdd() - 7){
                    $scope.dailyDates.push($filter('date')(new Date(date.toString().replace(pattern, '$1-$2-$3'))));
                    $scope.dailyCals.push(response[i].calories);
                    $scope.dailyTargetCals.push($scope.target);
                }
            }
            
            // finished data ready for the graphs
            $scope.data = [$scope.cals, $scope.targetCals];
            $scope.monthlyData = [$scope.monthlyCals, $scope.monthlyTargetCals];
            $scope.dailyData = [$scope.dailyCals, $scope.dailyTargetCals];
        }).
        error(function (err) {
            console.log(err);
            $location.path('/account/diary');
        }); 
    }
    //get screen size so that i can change the chart type depending on the device size
    var screenWidth = $(window).width();
    //if the width is greater than 700
    if (screenWidth > 700){
        $scope.chartPolar = false;
        $scope.chartLine = true;    
    }else{
        $scope.chartLine = false;
        $scope.chartPolar = true;
    }
    
    // graph settings
    $scope.series = ['Calories', 'Goal Calorie Amount']; 
    $scope.options = {scales: {yAxes: [{id: 'y-axis-1', type: 'linear', display: true, position: 'left'}]}};
    $scope.colors = ['#3f51b5','#4caf50'],
    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };
});
app.controller('QuickAddController', function ($scope, $http, $route, chosenMeal) {
    //add cals sends the selected data to the server to then be added to the users food data for that day in the database
    $scope.addCals = function () {
        console.log(chosenMeal + " : " + $scope.cals);
        //create an object holding all the information
        var diaryEntry = {[chosenMeal]: [{"name": "Quick Add","calories": $scope.cals, "servings": 1,"nutrients": {"fat": 0,"carbs": 0,"protein": 0}}]};
        //use a post method to send the data to the server
        $http({
            method: 'POST',
            url: '/account/diary',
            data: diaryEntry
        }).
        success(function (response) {
            $route.reload();
        }).
        error(function (err) {
            console.log(err);
        });
    };
});
//Text search controller
app.controller('TextSearchController', function ($scope, $location, $http, Meal, ModalService) {
    //assign the value from the factory giving the meal type
    var selectedMeal = {meal: Meal.Meal};
    $scope.meal = selectedMeal.meal;
    
    //get the custome meal items from the server
    $scope.getCustoms = function() {
        //send get request to get the custom items for the users
        $http({
            method: 'GET',
            url: '/account/custom',
        }).//when a success has been called
        success(function (response) { 
            //empty array that will hold the meal key values
            $scope.keys = [];
            $scope.customMeals = response[0].customs;
            //loop over the meals
            for(var i = 0;i<$scope.customMeals.length;i++){
                //push the key values to the key array
                $scope.keys.push(Object.keys($scope.customMeals[i]));
            }
        }).
        error(function (response) {
            console.log(response);
        });
    }
    
    //function that will add the data from a users custom meal
    $scope.addCustom = function(custommeal,key) {
        //loop over the custom meal and send each item to the server
        for(var i=0;i<custommeal[key].length;i++){
        //use a post method to send the data to the server
            $http({
                method: 'POST',
                url: '/account/diary',
                data: {[$scope.meal]:custommeal[key][i]}
            }).
            success(function (response) {
                console.log(response);
            }).
            error(function (err) {
                console.log(err);
            });            
        }//when done redirect to the diary page
        $location.path('/account/diary');
    }
    
    //get the users most popular items for the selected meal from the server
    $scope.getPopular = function(){
        //send get request to get the most pupular items for the users
        $http({
            method: 'POST',
            url: '/account/textsearch',
            data: selectedMeal,
        }).//on success assign the data to the pop variable
        success(function (response) {
            $scope.popular = response;
        }).
        error(function (response) {
            $location.path('/account/diary');
        });
    }
    //if the meal variable is empty redirect to the diary page
    if($scope.meal == ""){
       $location.path('/account/diary');
    }
    else{//call the functions to get the popular and custom items
        $scope.getCustoms();
        $scope.getPopular();
    }
    
    //each key press triggers the searh function
    $scope.foodTextSearch = function (search) {

        //the if statement makes sure the ng change doesnt trigger a search with an empty string
        if (search) {
            //hide the most popular when there is a search 
            $scope.showPopular = false;
            //api used for the search
            var searchURL = "https://uk.openfoodfacts.org/cgi/search.pl?search_terms=" + search + "&search_simple=1&json=1";
            //http request to fetch the data
            $http({
                method: 'GET',
                url: searchURL,
                dataType: "json"
            }).
            success(function (response) {
                $scope.results = [];
                // only pushes the item to the array variable if the information about it is complete
                for(var i=0;i<response.products.length;i++){
                    if(response.products[i].complete == 1){
                        $scope.results.push(response.products[i]);
                       }
                }
            }).
            error(function (response) {
                console.log("err " + response);
            });
        }
    }
    
    //function called to add the selected food
    $scope.foodInformation = function (food) {
        //modal is called in a separate controller
        ModalService.showModal({
            templateUrl: './views/addfood.html',
            controller: 'AddFoodController',
            // two variables are sent to the controller 
            inputs: {
                food: food,
                meal: selectedMeal.meal
            }
        }).then(function (modal) {
            modal.element.modal();
        });
    };
    
});
//# sourceMappingURL=maps/app.js.map
