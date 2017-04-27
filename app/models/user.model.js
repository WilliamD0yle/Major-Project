'use strict';

/********************************
 Dependencies
 ********************************/

var mongoose = require('mongoose');
var Schema = mongoose.Schema; 
var bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

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
    customs: [],
    password: {type: String, required: true}
});

accountSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

accountSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('users', accountSchema);
