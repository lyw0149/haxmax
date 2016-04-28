// Invoke 'strict' JavaScript mode
'use strict';

// Create the 'example' controller
angular.module('controlpanel').
controller('appController',['$scope','Authentication','$http','$location',function($scope,Authentication,$http,$location){
		
		
		
		$scope.name = Authentication.user ? Authentication.user.fullName : 'HAXMAX controlpanel';
		$scope.$on('LOAD',function(){$scope.loading=true});
		$scope.$on('UNLOAD',function(){$scope.loading=false});
		console.log($location.$$path.split('/')[1]);
		
		$scope.clickNav = function(currentPage){
			$scope.pageName = currentPage;
			
			
		}
	$scope.shouldShow=true;
	
}]).
controller('mainController', ['$scope', 'Authentication','$http',
	function($scope, Authentication,$http) {
		$scope.$emit('LOAD')
		// Get the user's 'fullName' 
		
		
		
		// $http.jsonp('https://filltext.com/?rows=10&delay=5&fname={firstName}&callback=JSON_CALLBACK')
		// .success(function(data){
		// 	// $scope.people=data
			
		// })
		
		 $scope.$emit('UNLOAD');
	}
]).
controller('commandController',['$scope',function($scope){
		
}]).
controller('missionsController',['$scope',function($scope){
		
}]).
controller('devicesController',['$scope',function($scope){
		
}]).
controller('applicationsController',['$scope',function($scope){
	
}])
