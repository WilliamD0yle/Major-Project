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