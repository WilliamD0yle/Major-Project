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
                    return res.status(500).send('Error saving new account (database error). Please try again.');
                }
                console.log(user);
                //send user the confirmation that the account has been created
                return res.status(200).send('Account created! Please login with your new account.');
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
            //creating user id session
            req.session.userCals = user.calories;
            //user found send 200 success status 
            res.status(200).send(req.session.user_id);
            //send caloreis to be used elsewhere 
            res.send(req.session.userCals);
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
    
var today = parseInt(JSON.stringify(new DateOnly));
    
    app.get('/account/diary', function (req, res) {
        //check if the user is logged in
        if (!req.session.user) {
            return res.status(401).send("Please log in.");
        }

        //create a blank entry for todays date. The users food choices will be added one at a time to the food arrays
        var blankEntry = new user_food({
            user_id: req.session.user_id,
            calories: req.session.userCals,
            date: new DateOnly(),
            breakfast: [],
            lunch: [],
            dinner: [],
            snacks: []
        });
        
        //Find the diary information
        user_food.findOne({user_id : req.session.user_id, date: today}, function (err, diary) {
            if(err){
                console.log("err " + err);
                return res.status(500).send(err);  
            }
            else if(diary == null){
                //save the blank entry
                blankEntry.save(function (err, diary) {
                    //if there is an error send error message
                    if (err) {
                        console.log(" err " + err);
                    }
                    else{
                        return res.status(200).send(diary); 
                    }
                });
            }
            else{
                return res.status(200).send(diary); 
            }
        });
    });
    
    /********************************
    Search Page
    ********************************/
    
    app.get('/account/textsearch', function (req, res) {
        
        console.log(req.body);
        
        //Most popular search for the user
//        user_food.aggregate({$unwind: "$snacks"}, {$sortByCount: "$snacks.name"}, function(err, results){
//            if(err){
//                console.log("something went wrong: " + err);
//            }
//            else{
//                console.log(results);
//            }
//        });
    });
    
    //add single food item
    app.post('/account/diary', function (req, res) {
        
        // getting the meal name so that i can use it to post the food data to the collect object array
        var meal = Object.keys(req.body).shift();
        
        // getting the foods to then add to the array
        var food = req.body[Object.keys(req.body)].shift();
        console.log("meal: " + meal + " food: " + food);
        // search for an entry with todays date and update with the posted data
        user_food.findOneAndUpdate({user_id : req.session.user_id, date: today}, {$push: {[meal]: food}}, function(err, other){
            if(err){
                console.log("something went wrong: " + err);
                return res.status(500).send(err);
            }
            else{
                return res.status(200).send(other);
            }
        });

    });
    
    //get single food item
    app.post('/account/food/info', function (req, res) {
        
        var meal = req.body.meal;
        var food = req.body.food;
        
        // search for an entry with todays date 
        user_food.findOne({user_id : req.session.user_id, date: today}, {[meal]: food}, function(err, item){
            if(err){
                console.log("something went wrong: " + err);
                return res.status(500).send(err);
            }
            else{
                return res.status(200).send(item);
            }
        });
    });
    
    //update single food item
    app.post('/account/food/update', function (req, res) {
        
        var meal = req.body.meal;
        var food = req.body.food;
        var serving = req.body.serving;
        var calories = req.body.totalCals;
        var nutrients = {protein:req.body.protein, carbs:req.body.carbs, fat:req.body.fats};
        
        var query = meal+'.name';
        var queryCal = meal+".$.calories";
        var queryServ = meal+".$.servings";
        var queryNut = meal+".$.nutrients";

        // search for an entry with todays date, meal, food and update the entry
        user_food.update({user_id : req.session.user_id, date: today, [query]: food},{$set: {[queryCal]: calories,[queryServ]: serving,[queryNut]: nutrients}},function(err, other){
            if(err){
                return res.status(500).send(err);
            }
            else{
                return res.status(200).send(other);
            }
        });
        
    });
    
    //delete single food item
    app.post('/account/food/delete', function (req, res) {
        //get the meal to be deleted
        var meal = req.body.meal;
        //get the food that needs to be deleted
        var food = req.body.food;

        // search for an entry with todays date, meal, food and pull from the entry
        user_food.update({user_id : req.session.user_id, date: today}, {$pull: {[meal]:{name:food}}}, function(err, other){
            if(err){
                console.log("something went wrong: " + err);
                return res.status(500).send(err);
            }
            else{
                return res.status(200).send(other);
            }
        });

    });
};