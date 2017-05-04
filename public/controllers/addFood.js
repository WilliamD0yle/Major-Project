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