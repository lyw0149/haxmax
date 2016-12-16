'user strict';

var mongoose = require('mongoose'),
	crypto = require('crypto'),
	Schema = mongoose.Schema;
var ActionSchema = require('./action.server.model.js')
	
var MissionSchema = new Schema({
    
    userID: {
		type: String,
		required: 'UserID is required'
	},
    actions : [ActionSchema]
    /*
    eta : {
        type: Number,
        required: true
    }*/
    
})

mongoose.model('Mission', MissionSchema);