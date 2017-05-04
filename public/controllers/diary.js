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