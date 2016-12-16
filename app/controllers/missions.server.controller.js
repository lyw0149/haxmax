// Invoke 'strict' JavaScript mode
'use strict';
var ObjectId = require('mongodb').ObjectID;
var Mission = require("mongoose").model("Mission");
var User = require("mongoose").model("User");
var getErrorMessage = function(err) {
	// Define the error message variable
	var message = '';

	// If an internal MongoDB error occurs get the error message
	if (err.code) {
		switch (err.code) {
			// If a unique index error occurs set the message error
			case 11000:
			case 11001:
				message = 'S/N already exists';
				break;
			// If a general error occurs set the message error
			default:
				message = 'Something went wrong';
		}
	} else {
		// Grab the first error message from a list of possible errors
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	// Return the message error
	return message;
};

// Create a new 'render' controller method
exports.addMission = function(req, res, next) {
    if (req.user) {
        var mission = new Mission(req.body);
        mission.userID = ObjectId(req.user._id);

        mission.save(function(err) {
            var message = "success"
            if (err) {
                message = getErrorMessage(err)

            }
            res.send(message);

        });

    }
}

exports.getMission = function(req, res, next) {
    if (req.user) {
        Mission.find({
            userID: req.user._id
        }).exec(function(err, mission) {
            if (err) {
                console.err(err);
                throw err;
            }
            res.json({
                mission: mission

            });
        });
    }
}