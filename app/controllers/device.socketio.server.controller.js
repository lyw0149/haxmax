// Invoke 'strict' JavaScript mode
'use strict';


// Create the chat configuration
module.exports = function(io, socket) {
    socket.on('disconnect', function() {
       console.log("device disconnected.")
    });
    
    socket.on('report',function(data){
        console.log(data);
    });

};
