'use strict';

/********************************
 Dependencies
 ********************************/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//takes the time element off the date element to make seraching via date easier
var DateOnly = require('mongoose-dateonly')(mongoose);

/********************************
 User food Schema
 ********************************/

var userFoodSchema = new Schema({
    user_id: {type : Schema.Types.ObjectId},
    date: { type: Date, DateOnly},
    breakfast: [],
    lunch: [],
    dinner:[],
    snacks:[]
});

module.exports = mongoose.model('user_foods', userFoodSchema);
