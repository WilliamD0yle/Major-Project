// Create the factory that share the meal type to any controller
app.factory('Meal', function () {
    return {Meal: '',
        update: function (meal) {
            this.Meal = meal;
        }
    };
});