//progress controller
app.controller('ProgressController', function ($scope, $location, $http, $filter) {
    
    //get the diary information from the server
    $http({
        method: 'GET',
        url: '/account/diary'
    }).
    success(function (response) {
        //assign target the value of the users calories
        $scope.target = response.calories;
        $scope.progress();
    }).//if theres an error redirect to the diary
    error(function (response) {
        $location.path('/');
    });
    
    // get user info
    $scope.progress = function(){
        //get the full calorie information for this user from the server
        $http({
            method: 'GET',
            url: '/account/progress',
        }).
        success(function (response) {
            // creating arrays to hold graph data
            $scope.cals = [];
            $scope.targetCals = [];
            $scope.monthlyTargetCals = [];
            $scope.dailyTargetCals = [];
            $scope.dates = [];
            $scope.monthlyDates = [];
            $scope.monthlyCals = [];
            $scope.dailyDates = [];
            $scope.dailyCals = [];
            
            //pattern to decode the date from the database
            var pattern = /(\d{4})(\d{2})(\d{2})/;
            var monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
            
            var d = new Date();
            var thisMonth = monthNames[d.getMonth()];
            var today = d.getDate();
            Date.prototype.yyyymmdd = function() {
              var mm = this.getMonth() + 1;
              var dd = this.getDate();

              return [this.getFullYear(),
                      (mm>9 ? '' : '0') + mm,
                      (dd>9 ? '' : '0') + dd
                     ].join('');
            };

            var currentDate = new Date();

            //loop over the information to sort into the correct arrays
            for(var i=0;i<response.length;i++){
                
                var date = response[i].date + 100;
                // all entris are shown for long term overview
                $scope.cals.push(response[i].calories);
                $scope.dates.push($filter('date')(new Date(date.toString().replace(pattern, '$1-$2-$3'))));
                $scope.targetCals.push($scope.target);
                
                //if its in this month or the previous month
                if(response[i].date + 100 >= currentDate.yyyymmdd() - 100){
                    $scope.monthlyDates.push($filter('date')(new Date(date.toString().replace(pattern, '$1-$2-$3'))));
                    $scope.monthlyCals.push(response[i].calories);
                    $scope.monthlyTargetCals.push($scope.target);
                }
                
                //if the entry is within the last 7 days
                if(response[i].date + 100 > currentDate.yyyymmdd() - 7){
                    $scope.dailyDates.push($filter('date')(new Date(date.toString().replace(pattern, '$1-$2-$3'))));
                    $scope.dailyCals.push(response[i].calories);
                    $scope.dailyTargetCals.push($scope.target);
                }
            }
            
            // finished data ready for the graphs
            $scope.data = [$scope.cals, $scope.targetCals];
            $scope.monthlyData = [$scope.monthlyCals, $scope.monthlyTargetCals];
            $scope.dailyData = [$scope.dailyCals, $scope.dailyTargetCals];
        }).
        error(function (err) {
            console.log(err);
            $location.path('/account/diary');
        }); 
    }
    //get screen size so that i can change the chart type depending on the device size
    var screenWidth = $(window).width();
    //if the width is greater than 700
    if (screenWidth > 700){
        $scope.chartPolar = false;
        $scope.chartLine = true;    
    }else{
        $scope.chartLine = false;
        $scope.chartPolar = true;
    }
    
    // graph settings
    $scope.series = ['Calories', 'Goal Calorie Amount']; 
    $scope.options = {scales: {yAxes: [{id: 'y-axis-1', type: 'linear', display: true, position: 'left'}]}};
    $scope.colors = ['#3f51b5','#4caf50'],
    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };
});