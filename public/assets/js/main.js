$(document).ready(function () {

    $("input").on("keydown", function search(e) {

        if (e.keyCode == 13) {
            var searching = $("input").val();
            foodTextSearch(searching);
            $("#results").empty();
            return false;
        }
    });

    function foodTextSearch(search) {

        var searchURL = "https://uk.openfoodfacts.org/cgi/search.pl?search_terms=" + search + "&search_simple=1&json=1"

        console.log(searchURL);
        $.ajax({
            //using the type of get to "Get" the json file
            type: "GET", //location of the file to get
            url: searchURL, // the url to get the data
            dataType: "json", // the type of data being pulled
            success: function (data) { //if its successful
                returnTextResults(data);
            }, // if the ajax call is unsuccessful run the function
            error: function (xhr, status, error) {
                if (xhr.status == "404") {
                    console.log(xhr, status, error);
                } else if (xhr.status == "500") {
                    console.log(xhr, status, error);
                }
            }
        });
    }

    function returnTextResults(data) {

        var i = 0;

        $.each(data.products, function (key, value) {

            var item = data.products[i].product_name;
            var calories = data.products[i].nutriments.energy;
            $(".results").append('<div class="col-sm-12"><div class="col-xs-6 text-left"><p>' + item + '</p></div><div class="col-xs-6 text-right"><p>' + calories + ' cals</p></div></div>');
            i++;
        });
    }

});