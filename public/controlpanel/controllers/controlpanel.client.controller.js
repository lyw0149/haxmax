// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'example' controller
angular.module('controlpanel').
controller('appController', ['$scope', 'Authentication', '$http', '$location', function($scope, Authentication, $http, $location) {



	$scope.name = Authentication.user ? Authentication.user.fullName : 'HAXMAX controlpanel';
	$scope.$on('LOAD', function() {
		$scope.loading = true
	});
	$scope.$on('UNLOAD', function() {
		$scope.loading = false
	});
	console.log($location.$$path.split('/')[1]);

	$scope.clickNav = function(currentPage) {
		$scope.pageName = currentPage;


	}
	$scope.shouldShow = true;





}]).
controller('mainController', ['$scope', 'Authentication', '$http',
	function($scope, Authentication, $http) {
		$scope.$emit('LOAD')
			// Get the user's 'fullName' 



		// $http.jsonp('https://filltext.com/?rows=10&delay=5&fname={firstName}&callback=JSON_CALLBACK')
		// .success(function(data){
		// 	// $scope.people=data

		// })

		$scope.$emit('UNLOAD');
	}
]).
controller('commandController', ['$scope', function($scope) {

}]).
controller('missionsController', ['$scope', function($scope) {

}]).
controller('devicesController', ['socket','$scope', '$http', function(socket,$scope, $http) {
	$scope.errorMsg = "";
	getDevice();
	//click function
	$scope.addDevice = function() {
		var addingDevice = {
			serialNumber: $scope.serialNumber,
			model: $scope.model
		}
		$http({
				method: 'POST',
				url: 'https://yw1-leeyangwoo.c9users.io/addDevice',
				data: addingDevice,
				headers: {
					'Content-Type': 'application/json; charset=utf-8'
				}
			})
			.success(function(data, status, headers, config) {
				if (data) {
					console.log("msg:" +data)
					if (data == "success") {
						getDevice();
					}else{
						$scope.errorMsg = "ERR : "+data; 
					}
				}
				else {
					/* 통신한 URL에서 데이터가 넘어오지 않았을 때 처리 */
				}
			})
			.error(function(data, status, headers, config) {
				console.log(status);
			});
	}
	
	function getDevice() {
		$http({
			method: 'GET',
			url: 'https://yw1-leeyangwoo.c9users.io/getDevice',
			headers: {
				'Content-Type': 'application/json; charset=utf-8'
			}
		}).success(
			function(data) {
			//	console.log(data.);
				$scope.offlineCount = data.count.offline;
				$scope.onlineCount = data.count.online;
				$scope.onairCount = data.count.onair;
				$scope.availableCount = data.count.available;
				$scope.device = data.device;
				//console.log($scope['device])
			});
	}
	
	//socket part
	
          console.log("connected"); 
           getDevice();
            socket.on("refreshDevice",function(){
                getDevice();
            })
     

}]).
controller('applicationsController', ['$scope', function($scope) {

}])
