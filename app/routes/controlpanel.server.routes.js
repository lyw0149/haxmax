// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var controlpanel = require('../../app/controllers/controlpanel.server.controller'),
    devices = require('../../app/controllers/devices.server.controller'),
    missions = require('../../app/controllers/missions.server.controller'),
	passport = require('passport');

// Define the routes module' method
module.exports = function(app) {


	app.route('/controlpanel').get(controlpanel.render);
	 //  .post(users.signup);

	app.route('/addDevice').post(devices.addDevice);
	app.route('/getDevice').get(devices.getDevice);
	
	app.route('/addMission').post(missions.addMission);
	app.route('/getMission').get(missions.getMission);
	
};