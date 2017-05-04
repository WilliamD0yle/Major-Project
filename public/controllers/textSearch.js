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