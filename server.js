'use strict';
/********************************
 Dependencies 
 ********************************/
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var morgan = require('morgan');
var session = require('client-sessions');
var User = require('./app/models/user.model');

// Configs
var db = require('./config/db');

mongoose.Promise = global.Promise;
// Connect to the DB
mongoose.connect(db.url);

// Initialize the Express App
var app = express();

// Configure session
app.use(session({
  cookieName: 'session',
  secret: 'random_string_goes_here'
}));
// To expose public assets to the world
app.use(express.static(__dirname + '/public'));

// log every request to the console
app.use(morgan('dev'));

// For parsing HTTP responses
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//Express Routes
require('./app/routes/routes')(app);

// Start the app with listen and a port number
app.listen(6001);

/********************************
Create Account
********************************/
app.post('/account/create', function (req, res) {

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

/********************************
Login to Account
********************************/

app.post('/account/login', function (req, res) {

    var username = req.body.username;
    var password = req.body.password;

    //Check for the username in the mongo database
    User.findOne({username: username, password: password}, function (err, user) {
        //if there is an error
        if (err) {
            console.log(err);
            res.status(500).send('Error (database error). Please try again.');
            return;
        }
        //if the user is not found
        if(!user){
            res.status(404).send('User not found. Please create an account to login.');
            return;
        }
        //creating user session
        req.session.user = username;
        //user found send 200 success status 
        res.status(200).send();
        return; 
    });
});

/********************************
Log out
********************************/

app.get('/account/logout', function(req,res){
    console.log(req.session.user);
    // Destroys user's session
    req.session.destroy();
//    res.redirect('/account/login');
});

/********************************
User Diary Page
********************************/

app.get('/account/diary', function (req, res) {
    console.log(req.session.user);
    //check if the user is logged in
    if(!req.session){
        res.status(401);
        res.redirect('/account/login');
    }
    //user is logged in send 200 success status 
    return res.status(200).send();  
});


