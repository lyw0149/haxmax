// Invoke 'strict' JavaScript mode
'use strict';
var baseURL = 'https://yw1-leeyangwoo.c9users.io';
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
controller('commandController', ['$scope','socket', function($scope,socket) {
	
	$scope.commandTask = function(task) {
		socket.emit("commandTask", {
			taskID:task,
			targetDeviceID:'abcdefg'
		});
	}

	$scope.$emit('UNLOAD');
}]).
controller('missionsController', ['$scope', '$http','daum', function($scope, $http,daum) {
	$scope.actions = [];
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
	
	daum.onClick(function(mouseEvent) {
		var latlng = mouseEvent.latLng;
		$scope.currentAction.lat = latlng.getLat();
		$scope.currentAction.lng = latlng.getLng();
	})
	
	$scope.initAction = function() {
		$scope.currentAction.lat = null;
		$scope.currentAction.lng = null;
	}
	
	$scope.addAction = function() {
		if ($scope.currentAction.type != '') {
			if($scope.currentAction.type == 'move'){
				if($scope.currentAction.lat && $scope.currentAction.lng){
					var action = angular.copy($scope.currentAction);
					$scope.actions.push(action);
				}
			}else{
				var action = angular.copy($scope.currentAction);
				$scope.actions.push(action);
			}
		}
	}
	
	$scope.searchCord = function() {
		if ($scope.currentAction.lat && $scope.currentAction.lng){
			var lat = angular.copy($scope.currentAction.lat);
			var lng = angular.copy($scope.currentAction.lng);
			daum.panTo(lat,lng);
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
									console.log(place.latitude,place.longitude)
									$scope.currentAction.lat = place.latitude;
									$scope.currentAction.lng = place.longitude;
								}
								
							});
					}else{
						place = addrJson.channel.item[0]
						daum.panTo(place.lat,place.lng)
						$scope.currentAction.lat = place.latitude;
						$scope.currentAction.lng = place.longitude;
					}
					
				});
			$scope.inputAddr = ""
		}
	}
	
	$scope.addMission = function() {
		var addingMission = {
			actions : $scope.actions
		}
		$http({
				method: 'POST',
				url: baseURL+'/addMission',
				data: addingMission,
				header: {
					'Content-Type': 'application/json; charset=utf-8'
				}
			}).success(function(data, status, haeaders, config){
				if (data) {
					if (data == 'success') {
						getMission();
					}
					else {
						$scope.errorMsg = "ERR : " + data;
					}
				}
				else {
					
				}
			}).error(function(data, status, headers, config){
				console.log(status)
			})
	}
	
	function getMission() {
		$scope.$emit('LOAD');
		$http({
			method: 'GET',
			url: baseURL+'/getMission',
			headers: {
				'Content-Type': 'application/json; charset=utf-8'
			}
		}).success(
			function(data) {
				$scope.missions = data.mission;
				$scope.$emit('UNLOAD');
				console.log($scope.missions);
			});
	}
	getMission();
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
				url: baseURL+'/addDevice',
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
			url: baseURL+'/getDevice',
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
