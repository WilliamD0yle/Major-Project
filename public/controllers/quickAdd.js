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