'use strict';

var config = require('./config'),
    cookieParser = require('cookie-parser'),
    passport = require('passport');

module.exports = function(server, io, mongoStore) {
	// Intercept Socket.io's handshake request
    io.use(function(socket, next) {
    	// Use the 'cookie-parser' module to parse the request cookies
        cookieParser(config.sessionSecret)(socket.request, {}, function(err) {
        	// Get the session id from the request cookies
            var sessionId = socket.request.signedCookies['connect.sid'];

            // Use the mongoStorage instance to get the Express session information
            mongoStore.get(sessionId, function(err, session) {
            	// Set the Socket.io session information
                socket.request.session = session;

                // Use Passport to populate the user details
                passport.initialize()(socket.request, {}, function() {
                	passport.session()(socket.request, {}, function() {
                //devide device and controlpanel
                // 		if (socket.request.user) {
                			next(null, true);
                // 		} else {
                // 			next(new Error('User is not authenticated'), false);
                // 		}
                	});
                });
            });
        });
    });
	
    io.on('connection', function(socket) {
    	if(socket.request.user){
    	    console.log("User "+socket.request.user._id+" is connected");
            require('../app/controllers/web.socketio.server.controller')(io, socket);
    	    
    	}else{
    	    //device : registration later
    	    console.log("Device connected");
    	    require('../app/controllers/device.socketio.server.controller')(io, socket);
    	    
    	}
    	
    });
};