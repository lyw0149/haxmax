// Invoke 'strict' JavaScript mode
'use strict';
var express = require("express");
// Define the routes module' method
module.exports = function(app) {
	// Load the 'index' controller
	var landing = require('../controllers/landing.server.controller');
	app.use(express.static('./public/landing'));
	// Mount the 'index' controller's 'render' method
	app.get('/', landing.render);
};