// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var controlpanel = require('../../app/controllers/controlpanel.server.controller'),
	passport = require('passport');

// Define the routes module' method
module.exports = function(app) {


	app.route('/controlpanel').get(controlpanel.render)
	 //  .post(users.signup);

};