'use strict';

/********************************
 Dependencies
 ********************************/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/********************************
 Create User Account Schema
 ********************************/
var accountSchema = new Schema({
    name: {type: String},
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true},
    gender: {type: String, required: true},
    age: {type: Number, required: true},
    calories: {type: Number, default: 2000},
    password: {type: String, required: true}
});

module.exports = mongoose.model('User', accountSchema);
