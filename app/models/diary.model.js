'use strict';

/********************************
 Dependencies
 ********************************/
var mongoose = require('mongoose');
var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;
/********************************
 User food Schema
 ********************************/

var userFoodSchema = new Schema({
    user_id: {type : ObjectId},
    date: {type: Date},
    breakfast: [{name: String, calories: Number}],
    lunch: [{name: String, calories: Number}],
    dinner:[{name: String, calories: Number}],
    snacks:[{name: String, calories: Number}]
});

module.exports = mongoose.model('user_food', userFoodSchema);