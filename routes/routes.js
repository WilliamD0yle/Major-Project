var users = require('../app/models/user.model');
var user_food = require('../app/models/diary.model');
var mongoose = require('mongoose');
//takes the time element off the date element to make seraching via date easier
var DateOnly = require('mongoose-dateonly')(mongoose);
module.exports = function (app) {

    /********************************
    Create Account
    ********************************/
    app.post('/account/create', function (req, res) {

        //Create new object that store's new user data
        var newUser = new users({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            gender: req.body.gender,
            age: req.body.age,
            calories: req.body.calories,
            password: req.body.password
        });

        //Check if the username exists
        users.findOne({username: req.body.username}, function (err, existingUser) {
            //if the user exists
            if (existingUser) {
                return res.status(400).send('That username already exists. Please try a different username.');
            }
            //save the new user
            newUser.save(function (err, user) {
                //if there is an error send error message
                if (err) {
                    console.log(err);
                    res.status(500).send('Error saving new account (database error). Please try again.');
                    return;
                }
                console.log(user);
                //send user the confirmation that the account has been created
                res.status(200).send('Account created! Please login with your new account.');
            });
        });
    });

    /********************************
    Login to Account
    ********************************/

    app.post('/account/login', function (req, res) {

        var username = req.body.username;
        var password = req.body.password;

        //Check for the username in the mongo database
        users.findOne({username: username,password: password}, function (err, user) {
            //if there is an error
            if (err) {
                console.log(err);
                res.status(500).send('Error (database error). Please try again.');
                return;
            }
            //if the user is not found
            if (!user) {
                res.status(404).send('User not found. Please create an account to login.');
                return;
            }
            //creating user session
            req.session.user = user.username;
            //creating user id session
            req.session.user_id = user._id;
            //user found send 200 success status 
            res.status(200).send(req.session.user_id );
            return;
        });
    });

    /********************************
    Log out
    ********************************/

    app.get('/account/logout', function (req, res) {
//        delete req.session;
//        req.logout();
//        console.log(req.session);
//        if(!req.session){
//            return res.status(200).send(req.session);
//        }
//        return res.status(401).send("Please log in.");
        return res.status(200).send('response');
    });

    /********************************
    User Diary Page
    ********************************/

    app.get('/account/diary', function (req, res) {
        //check if the user is logged in
        if (!req.session.user) {
            return res.status(401).send("Please log in.");
        }
        var today = parseInt(JSON.stringify(new DateOnly));
        //Find the diary information
        user_food.findOne({user_id : req.session.user_id, date: today}, function (err, diary) {
            if(err){
                console.log(err);
                return res.status(500).send(err);  
            }
            else{
                console.log(diary);
                return res.status(200).send(diary); 
            }
        });
    });
    
    app.post('/account/diary', function (req, res) {
        console.log(req.body);
        //Create new object that store's new user data
        var newEntry = new user_food({
            user_id: req.session.user_id,
            date: new DateOnly(),
            breakfast: [req.body.breakfast],
            lunch: [req.body.lunch],
            dinner: [req.body.dinner],
            snacks: [req.body.snacks]
        });
        console.log(newEntry);
        //save the new user
        newEntry.save(function (err, diary) {
            if(err){
                console.log(err);
                return res.status(500).send(err);    
            }
            else{
                console.log(diary);
                return res.status(200).send(diary); 
            }
        });
    });
};