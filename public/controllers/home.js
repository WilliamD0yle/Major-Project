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