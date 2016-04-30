// Invoke 'strict' JavaScript mode
'use strict';
var ObjectId = require('mongodb').ObjectID;
var Device = require("mongoose").model("Device");
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
exports.addDevice = function(req, res, next) {
    if (req.user) {
        var device = new Device(req.body);
        device.userID = ObjectId(req.user._id);

        device.save(function(err) {
            var message = "success"
            if (err) {
                message = getErrorMessage(err)

            }
            res.send(message);

        });

    }
};
exports.getDevice = function(req, res, next) {
    if (req.user) {

        Device.find({
            userID: req.user._id
        }).select("serialNumber model state created").exec(function(err, device) {
            if (err) {
                console.err(err);
                throw err;
            }
            Device.aggregate(
                [{
                    $match: {
                        "userID": req.user._id.toString()
                    }
                }, {
                    $group: {
                        _id: '$state',
                        count: {
                            $sum: 1
                        }
                    }
                }]
            ).
            exec(function(err, count) {
                if (err) {
                    console.err(err);
                    throw err;
                }
                console.log(count)
                var mCount = {};
                for (var i = 0; i < count.length; count++) {
                    switch (count[i]._id) {
                        case 'online':
                            mCount.online = count[i].count;
                            break;
                        case 'offline':
                            mCount.offline = count[i].count;
                            break;
                        case 'available':
                            mCount.available = count[i].count;
                            break;
                        case 'onair':
                            mCount.onair = count[i].count;
                            break;

                        default:
                            // code
                    }
                }
                mCount.online = mCount.online || 0;
                mCount.offline = mCount.offline || 0;
                mCount.available = mCount.available || 0;
                mCount.onair = mCount.onair || 0;

                res.json({
                    count: mCount,
                    device: device

                });

            });

            // Device.find({
            //     userID: ObjectId(req.user._id)
            // }).count({
            //     state: "offline"
            // }).exec(function(err, count) {

            //     // 
            // });
        });





    }


}