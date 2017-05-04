app.controller('FoodContentController', function ($scope, $http, $route, chosenMeal, food) {
    
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