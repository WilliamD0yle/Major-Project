'use strict';

/********************************
 Dependencies
 ********************************/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/********************************
 User food Schema
 ********************************/

var userFoodSchema = new Schema({
    user_id: {type : Schema.Types.ObjectId, required: true},
    date: {},
    breakfast: [],
    lunch: [],
    dinner:[],
    snacks:[]
});

module.exports = mongoose.model('user_foods', userFoodSchema);
