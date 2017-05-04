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