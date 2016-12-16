// Invoke 'strict' JavaScript mode
'use strict';
var Device = require("mongoose").model("Device");
var User = require("mongoose").model("User");
var ObjectId = require('mongodb').ObjectID;
// Create the chat configuration
module.exports = function(io, socket) {
    updateSocketID(socket);

    socket.on('disconnect', function() {
        flushSocketID(socket);
    });
    
    socket.on('commandTask', function(task) {
        console.log(task)
        sendCommand(io,task);
    });
};
function sendCommand(io,task){
    getDeviceSocketID(task.targetDeviceID,function(deviceSocketID){
        io.to(deviceSocketID).emit("commandTask", task);
        //console.log(deviceSocketID);
    })
    
    
}

function getDeviceSocketID(serialNumber, callback) {
    
    var query = {
        serialNumber : serialNumber
    }
    Device.findOne(query).exec(function(err, doc) {
        if (err) {
            console.log(err);
        }
        if (typeof(callback) === "function") {
            //console.log(doc)
            callback(doc.socketID);
           
        }
    });
}



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
         console.log(doc);
    });
}

function flushSocketID(socket) {
    var query = {
        _id: ObjectId(socket.request.user._id)
    };
    var newData = {
        socketID: ""
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