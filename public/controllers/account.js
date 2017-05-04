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