// Invoke 'strict' JavaScript mode
'use strict';

// Configure the 'example' module routes
angular.module('controlpanel').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/', {
			templateUrl: 'controlpanel/views/main.controlpanel.client.view.html'
		}).
		when('/command', {
			templateUrl: 'controlpanel/views/command.controlpanel.client.view.html'
		}).
		when('/missions', {
			templateUrl: 'controlpanel/views/missions.controlpanel.client.view.html'
		}).
		when('/devices', {
			templateUrl: 'controlpanel/views/devices.controlpanel.client.view.html'
		}).
		when('/applications', {
			templateUrl: 'controlpanel/views/applications.controlpanel.client.view.html'
		}).
		otherwise({
			redirectTo: '/'
		});
		
	}
]); 
