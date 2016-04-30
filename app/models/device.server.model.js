// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	crypto = require('crypto'),
	Schema = mongoose.Schema;

// Define a new 'UserSchema'
var DeviceSchema = new Schema({
	serialNumber: {
		type : String,
		index: {unique: true},
	    required: 'SerialNumber is required'
	    
	},
	userID: {
		type: String,
		required: 'UserID is required',
	},
	// password: {
	// 	type: String,
	// 	// Validate the 'password' value length
	// 	validate: [

	// 		function(password) {
	// 			return password && password.length > 6;
	// 		}, 'Password should be longer'
	// 	]
	// },
	model: {
		type : String,
		required: 'Model is required',
	},
	created: {
		type: Date,
		default: Date.now
	},
	state : {
		type: String,
		default: "offline"
	},
	cordX : {
		type :Number,
		default: -1
	},
	cordY : {
		type :Number,
		default: -1
	},
	Alti : {
		type :Number,
		default: -1
	},
	socketID: {
		type: String,
		default:""
	}
});


DeviceSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

// Create the 'User' model out of the 'UserSchema'
mongoose.model('Device', DeviceSchema);