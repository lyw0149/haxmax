// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'example' controller
angular.module('controlpanel', []).
controller('appController', ['$scope', 'Authentication', '$http', '$location', 'daum', function($scope, Authentication, $http, $location, daum) {
	$scope.loading = true;
	// $scope.map = {
	// 	center: {
	// 		latitude: 37.5157756,
	//       	longitude: 127.0339472
	// 	},
	// 	draggable: true, // or false
	// 	level: 7, // zoom lovel from 1 to 9
	// 		 mapTypeId: daum.maps.MapTypeId.HYBRID // refer to Daum Map Documentation for further info
	// }
	daum.onClick(function(mouseEvent) {
		var latlng = mouseEvent.latLng;

		var message = '클릭한 위치의 위도는 ' + latlng.getLat() + ' 이고, ';
		message += '경도는 ' + latlng.getLng() + ' 입니다';

		console.log(message);
	})

	$scope.name = Authentication.user ? Authentication.user.fullName : 'HAXMAX controlpanel';



	$scope.$on('UNLOAD', function() {
		$scope.loading = false
		angular.element(document.querySelector('#appWrapper')).css({
			opacity: 1
		});
	});
	$scope.$on('LOAD', function() {
		$scope.loading = true
		angular.element(document.querySelector('#appWrapper')).css({
			opacity: 0.1
		});
	});
	// console.log($location.$$path.split('/')[1]);

	$scope.clickNav = function(currentPage) {
		$scope.pageName = currentPage;


	}
	$scope.shouldShow = true;





}]).
controller('mainController', ['$scope', 'Authentication', '$http',
	function($scope, Authentication, $http) {
		$scope.$emit('LOAD');
		// Get the user's 'fullName' 



		// $http.jsonp('https://filltext.com/?rows=10&delay=5&fname={firstName}&callback=JSON_CALLBACK')
		// .success(function(data){
		// 	// $scope.people=data

		// })

		$scope.$emit('UNLOAD');
	}
]).
controller('commandController', ['$scope', function($scope) {

	$scope.$emit('UNLOAD');
}]).
controller('missionsController', ['$scope', '$http','daum', function($scope, $http,daum) {
	$scope.actionArray = [];
	$scope.actionTypes = [{
		'value': 'takeoff',
		'name': 'takeoff'
	}, {
		'value': 'land',
		'name': 'land'
	}, {
		'value': 'move',
		'name': 'move'
	}];

	$scope.addAction = function() {
		if ($scope.currentAction.type != '') {
			var action = angular.copy($scope.currentAction);
			$scope.actionArray.push(action);
		}
	}

	$scope.searchAddr = function() {
		if ($scope.inputAddr != "") {
			var searchName = angular.copy($scope.inputAddr);
			var place;
			$http.jsonp('https://apis.daum.net/local/geo/addr2coord?apikey=aa78ad6b214a1a7979cfac54e7b29fa8&q=' + searchName + '&output=json&callback=JSON_CALLBACK')
				.success(function(addrJson) {
					if (addrJson.channel.item.length==0) {
						$http.jsonp('https://apis.daum.net/local/v1/search/keyword.json?apikey=aa78ad6b214a1a7979cfac54e7b29fa8&query='+ searchName + '&output=json&callback=JSON_CALLBACK')
							.success(function(keywordJson) {
								if(keywordJson.channel.item.length==0){
									
								}else{
									place = keywordJson.channel.item[0]
									daum.panTo(place.latitude,place.longitude)
								}
								
							});
					}else{
						place = addrJson.channel.item[0]
						console.log(place)
						daum.panTo(place.lat,place.lng)
					}
					
					
				});
			$scope.inputAddr = ""
		}
	}
	$scope.$emit('UNLOAD');
}]).
controller('devicesController', ['socket', '$scope', '$http', function(socket, $scope, $http) {
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
					console.log("msg:" + data)
					if (data == "success") {
						getDevice();
					}
					else {
						$scope.errorMsg = "ERR : " + data;
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
		$scope.$emit('LOAD');
		$http({
			method: 'GET',
			url: 'https://yw1-leeyangwoo.c9users.io/getDevice',
			headers: {
				'Content-Type': 'application/json; charset=utf-8'
			}
		}).success(
			function(data) {
				console.log(data.count);
				$scope.offlineCount = data.count.offline;
				$scope.onlineCount = data.count.online;
				$scope.onairCount = data.count.onair;
				$scope.availableCount = data.count.available;
				$scope.device = data.device;
				$scope.$emit('UNLOAD');
			});
	}

	//socket part

	console.log("connected");
	$scope.$emit('UNLOAD');
	getDevice();
	socket.on("refreshDevice", function() {
		getDevice();
	})


}]).
controller('applicationsController', ['$scope', function($scope) {
	$scope.$emit('UNLOAD');
}])
