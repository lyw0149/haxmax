// Invoke 'strict' JavaScript mode
'use strict';

var Device = require("mongoose").model("Device");
var User = require("mongoose").model("User");

// Create the chat configuration
module.exports = function(io, socket) {
    socket.on('disconnect', function() {
        console.log("device disconnected.")
        updateDevice(socket.DeviceID, "offline", "");
        io.to(socket.userSocketID).emit("refreshDevice", "");
    });

    socket.on('req_auth', function(sockData) {
        if (sockData.DeviceID) {
            // console.log("receive from : " + sockData.DeviceID);
            Device.find({
                serialNumber: sockData.DeviceID
            }).exec(function(err, deviceData) {
                if (err) {
                    //close socket
                    sendError(socket, "connection refused.")
                    socket.disconnect();
                }
                else {
                    if (deviceData.length == 1) {
                        socket.emit('res_auth', {
                                resultCode: "success"
                            });
                            //refresh device state and socket id
                        socket.DeviceID = sockData.DeviceID;
                        updateDevice(socket.DeviceID, "online", socket.id);

                        getUserSocketID(deviceData.userID, function(userSocketID) {
                            io.to(userSocketID).emit("refreshDevice", "");
                            socket.userSocketID = userSocketID;
                        })
                    }
                    else {
                        //close.socket
                        sendError(socket, "connection refused.")
                        socket.disconnect();
                    }

                }
            })
        }
    })

    socket.on('report', function(data) {

        console.log(data);
    });

};

function updateDevice(DeviceID, state, socketID) {
    // console.log(DeviceID);
    var query = {
        'serialNumber': DeviceID
    };
    var newData = {
        state: state,
        socketID: socketID
    }
    Device.findOneAndUpdate(query, newData, {
        upsert: false
    }, function(err, doc) {
        if (err) console.log(err);
        // console.log(doc)
    });
}

function sendError(socket, message) {
    socket.emit("err", message);
}


function getUserSocketID(userID, callback) {
    var query = {
        userID: userID
    }
    User.findOne(query).exec(function(err, doc) {
        if (err) {
            console.log(err);
        }
        if (typeof(callback) === "function") {
            callback(doc.socketID);
        }
    });
}
