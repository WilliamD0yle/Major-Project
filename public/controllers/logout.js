//Logout controller
app.controller('LogOutController', function ($scope, $location, $http, Meal) {
    $("#sidebar-toggle").hide();
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
    }).
    error(function (response) {
        console.log(response);
        $location.path('/account/login');
    });

});