var mongoose = require('mongoose'),
Schema = mongoose.Schema;

// Validation helper methods should return booleans
// and should be defined before the schema for readability


// Model Schema
var ModelSchema = new Schema ({
	name : {
		type: String
	},
});

module.exports = mongoose.model('Model', ModelSchema);

//'use strict';
//
///********************************
// Dependencies
// ********************************/
//var mongoose = require('mongoose'),
//    bcrypt = require('bcrypt');
//
///********************************
// Create User Account Schema
// ********************************/
//var accountSchema = new mongoose.Schema({
//    username: {type: String, required: true, unique: true},
//    password: {type: String, required: true},
//    email: {type: String, required: true},
//    name: {type: String, required: true}
//});
//
//// Used by Passport middleware to validate password against what is stored in DB
//accountSchema.methods.validatePassword = function(password, hash) {
//    return bcrypt.compareSync(password, hash); // boolean return
//};
//
//module.exports = mongoose.model('User', accountSchema);