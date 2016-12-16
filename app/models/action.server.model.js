'user strict';

var mongoose = require('mongoose'),
	crypto = require('crypto'),
	Schema = mongoose.Schema;
	
var ActionSchema = new Schema({
    
    type : String,
    lat : {
      type : Number
    },
    lng : {
      type : Number
    }
    /*
    eta : {
        type: Number,
        required: true
    }*/
    
})