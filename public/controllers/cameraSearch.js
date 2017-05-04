//Search controller
app.controller('SearchController', function ($scope, $location, $http, $route, Meal, ModalService) {
    var selectedMeal = {meal: Meal.Meal};
    $scope.meal = selectedMeal.meal;
    //redirect if the user isnt logged in
    if(!$scope.meal){
       $location.path('/');
    }
    //start the camera on desktop
    var App = {
        init: function () {
            var self = this;

            Quagga.init(this.state, function (err) {
                if (err) {
                    return self.handleError(err);
                }
                //Start the camera
                Quagga.start();
            });
        },
        handleError: function (err) {
            //log the error
            console.log(err);
        },
        initCameraSelection: function(){
        var streamLabel = Quagga.CameraAccess.getActiveStreamLabel();

        return Quagga.CameraAccess.enumerateVideoDevices().then(function(devices) {
            function pruneText(text) {
                return text.length > 30 ? text.substr(0, 30) : text;
                }
                var $deviceSelection = document.getElementById("deviceSelection");
                while ($deviceSelection.firstChild) {
                    $deviceSelection.removeChild($deviceSelection.firstChild);
                }
                devices.forEach(function(device) {
                    var $option = document.createElement("option");
                    $option.value = device.deviceId || device.id;
                    $option.appendChild(document.createTextNode(pruneText(device.label || device.deviceId || device.id)));
                    $option.selected = streamLabel === device.label;
                    $deviceSelection.appendChild($option);
                });
            });
        },
        state: {
            inputStream: {
                name : "Live",
                type : "LiveStream",
                constraints: {
                    //rare facing camera if availible 
                    facingMode: "environment"
                },
                area: { // defines rectangle of the detection/localization area
                    top: "0%", // top offset
                    right: "0%", // right offset
                    left: "0%", // left offset
                    bottom: "0%" // bottom offset
                },
                singleChannel: false // true: only the red color-channel is read
            },
            numOfWorkers: 4,
            decoder: {
                readers: [{ //type of barcode then will be read - ean is used for food and beverage products
                    format: "ean_reader",
                    config: {
                        //supplements: ['ean_8_reader']
                    }
            }]
            },
            locate: true
        }
    };

    App.init();
	// Create the QuaggaJS config object for the live stream
    var liveStreamConfig = {
			inputStream: {
				type : "LiveStream",
				constraints: {
					facingMode: "environment" // or "user" for the front camera
				}
			},
			locator: {
				patchSize: "medium",
				halfSample: true
			},
			numOfWorkers: (navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 4),
			decoder: {
				"readers":[
					{"format":"ean_reader","config":{}}
				]
			},
			locate: true,
		};
    
	var fileConfig = $.extend({}, liveStreamConfig,{inputStream: {size: 800}});
	
	// Once a barcode had been read successfully, stop quagga
	Quagga.onDetected(function(result) {  
		if (result.codeResult.code){
            Quagga.stop();	
            $scope.barcodeSearch(result.codeResult.code);		
		}
	});
	// file input
	$(".container input:file").on("change", function(e) {
        Quagga.stop();	
		if (e.target.files && e.target.files.length) {
			Quagga.decodeSingle($.extend({}, fileConfig, {src: URL.createObjectURL(e.target.files[0])}), function(result) {});
		}
	});
    
    $scope.barcodeSearch = function (barcode) {
        var search = true;
        var searchURL = "https://world.openfoodfacts.org/api/v0/product/" + barcode + ".json";
        if(search){
            $http({
            method: 'GET',
            url: searchURL,
            }).
            success(function (response) {
                if(response.product.complete == 0){
                    alert("Product not found!");  
                    $location.path('/account/diary');
                   }else{
                    $scope.foodInformation(response.product);  
                   }
            }).
            error(function (response) {
                console.log(response);
            });
            search = false;
        } 
    };
    
    $scope.foodInformation = function (food) {
        ModalService.showModal({
            templateUrl: './views/addfood.html',
            controller: 'AddFoodController',
            inputs: {
                food: food,
                meal: selectedMeal.meal
            }
        }).then(function (modal) {
            modal.element.modal();
        });
    };

});