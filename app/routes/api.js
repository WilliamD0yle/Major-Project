'use strict';
// Module for API Routes (serving JSON)
module.exports = function (app) {
    var mongoose = require('mongoose');
    var User = require('../models/user.model');

    // Account
    app.post('/account/create', function (req, res) {
        console.log(req.body);
        //Create new object that store's new user data
        var newUser = new User({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            gender: req.body.gender,
            age: req.body.age,
            calories: req.body.calories,
            password: req.body.password
        });
        //Check if the username exists
        User.findOne({username: req.body.username}, function (err, existingUser) {
            //if the user exists
            if (existingUser) {
                return res.status(400).send('That username already exists. Please try a different username.');
            }
            //save the new user
            newUser.save(function (err) {
                //if there is an error send error message
                if (err) {
                    console.log(err);
                    res.status(500).send('Error saving new account (database error). Please try again.');
                    return;
                }
                //send user the confirmation that the account has been created
                res.status(200).send('Account created! Please login with your new account.');
            });
        });
    });
};