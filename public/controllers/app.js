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
    //Breakdown page
    when('/account/progress', {
        templateUrl: 'views/progress.html',
        controller: 'ProgressController'
    }).
    otherwise({
        redirectTo: '/account/login'
    });
});

//login controller
app.controller('HomeController', function ($scope, $location, $http) {
    
    console.log("working");
    
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

//Logout controller
app.controller('LogOutController', function ($scope, $location, $http) {

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
//        $location.path('/');
    }).
    error(function (response) {
        console.log(response);
        $location.path('/account/login');
    });

});

//Account controller
app.controller('AccountController', function ($scope, $location, $http) {
    
    // get user details
    $http({
        method: 'GET',
        url: '/account',
    }).
    success(function (response) {
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

            //loop over the information to sort into the correct arrays
            for(var i=0;i<response.length;i++){
                
                var date = response[i].date + 100;
                var month = $filter('date')(new Date(date.toString().replace(pattern, '$1-$2-$3')));
                var todaysDate = $filter('date')(new Date(date.toString().replace(pattern, '$1-$2-$3')));
                todaysDate = todaysDate.substring(3, 6);
                
                // all entris are shown for long term overview
                $scope.cals.push(response[i].calories);
                $scope.dates.push($filter('date')(new Date(date.toString().replace(pattern, '$1-$2-$3'))));
                $scope.targetCals.push($scope.target);
                
                //if its in this month or the previous month 
                if(todaysDate >= today){
                    $scope.monthlyDates.push($filter('date')(new Date(date.toString().replace(pattern, '$1-$2-$3'))));
                    $scope.monthlyCals.push(response[i].calories);
                    $scope.monthlyTargetCals.push($scope.target);
                }
                
                //if the entry is within the last 7 days
                if(thisMonth == month.substring(0, 3) && todaysDate >= today-7){
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
        }); 
    }
    
    // graph settings
    $scope.series = ['Calories', 'Goal Calorie Amount']; 
    $scope.options = {scales: {yAxes: [{id: 'y-axis-1', type: 'linear', display: true, position: 'left'}]}};
    $scope.colors = ['#3f51b5','#4caf50'],
    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };
});

// Create the factory that share the meal type to any controller
app.factory('Meal', function () {
    return {Meal: '',
        update: function (meal) {
            this.Meal = meal;
        }
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

app.controller('FoodContentController', function ($scope, $http, $route, chosenMeal, food) {
    
    $scope.chosenMeal = chosenMeal;
    
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

    $scope.totalCals = function () {
        return Math.ceil($scope.lowestcal * $scope.serving);
    };

    $scope.totalCarbs = function () {
        return Math.ceil($scope.lowestcarbs * $scope.serving);
    };

    $scope.totalFats = function () {
        return Math.ceil($scope.lowestfats * $scope.serving);

    };

    $scope.totalProtein = function () {
        return Math.ceil($scope.lowestprotein * $scope.serving);
    };
    
    //update the item  and send the details to the server
    $scope.updateFood = function (item, serving, totalCals, carbs, fats, protein) {
        
        var meal = {meal: $scope.chosenMeal, food: item, serving: serving, totalCals: totalCals(), protein: protein, carbs: carbs, fats: fats};
        console.log(meal);
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
    
    //remove food from the diary page
    $scope.removeFood = function (item) {

        var meal = {meal: $scope.chosenMeal, food: item};

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
            $location.path('/account/diary');
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

//Search controller
app.controller('SearchController', function ($scope, $location, $http, $route, Meal, ModalService) {
    //start the camera
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
            var code = result.codeResult.code;
            jQuery(".video").hide();
            jQuery(".enteredBarcode").html(code);
            $scope.barcodeSearch(code);
            Quagga.stop();
        });
    };

    //load the load function
    $scope.startQR();
    
    $scope.$on("$locationChangeStart", function(event) {
        Quagga.stop();
    });

    $scope.barcodeSearch = function (barcode) {

        var searchURL = "https://world.openfoodfacts.org/api/v0/product/" + barcode + ".json";
        $http({
            method: 'GET',
            url: searchURL,
        }).
        success(function (response) {
            if(response.product.complete == 0){
                alert("Product not found!");  
                $location.path('/account/diary');
               }else{
                $scope.foodInformation(response.product);  
               }
        }).
        error(function (response) {
            console.log(response);
        });
    };
    
    var selectedMeal = {meal: Meal.Meal};
    $scope.meal = selectedMeal.meal; 
    
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
