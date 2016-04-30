// Invoke 'strict' JavaScript mode
'use strict';
var Device = require("mongoose").model("Device");
var User = require("mongoose").model("User");
var ObjectId = require('mongodb').ObjectID;
// Create the chat configuration
module.exports = function(io, socket) {
    updateSocketID(socket);
    
    
        // Emit the status event when a socket client is disconnected
    socket.on('disconnect', function() {
        flushSocketID(socket);
    }); 
};

function updateSocketID(socket) {
    var query = {
        _id: ObjectId(socket.request.user._id)
    };
    var newData = {
        socketID: socket.id
    };

    User.findOneAndUpdate(query, newData, {
        upsert: false
    }, function(err, doc) {
        if (err) {
            console.log("ERR : " + err);
        }
        // console.log(doc);
    });
}

function flushSocketID(socket) {
    var query = {_id: ObjectId(socket.request.user._id)};
    var newData = {socketID: ""};

    User.findOneAndUpdate(query, newData, {
        upsert: false
    }, function(err, doc) {
        if (err) {
            console.log("ERR : " + err);
        }
        // console.log(doc);
    });
}