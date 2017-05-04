var users = require('../app/models/user.model');
var user_food = require('../app/models/diary.model');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
//takes the time element off the date element to make seraching via date easier
var DateOnly = require('mongoose-dateonly')(mongoose);
var ObjectID = require('mongodb').ObjectID;
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
        users.findOne({username: username}, function (err, user) {
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
            user.comparePassword(password, function(err, isMatch) {
                if (isMatch && isMatch == true){
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
                }else{
                    return res.status(401).send();
                }
            });
        });
    });
    
    /********************************
    Get account info
    ********************************/
    
    app.get('/account', function (req, res) {

        //Find the user in the database
        users.findOne({username: req.session.user}, function (err, user) {
            if (err) {
                console.log("something went wrong: " + err);
                return res.status(500).send(err);
            } else {
                return res.status(200).send(user);
            }
        });
        
    });
    
    /********************************
    update account info
    ********************************/
    
    app.post('/account/update', function (req, res) {
        
        var user = req.body.name;
        var username = req.body.username;
        var email = req.body.email;
        var gender = req.body.gender;
        var age = req.body.age;
        var height = req.body.height;
        var weight = req.body.weight;
        var calories = req.body.calories;
        
        var salt = bcrypt.genSaltSync(10),
        hash = bcrypt.hashSync(req.body.password, salt);
        //Find the user in the database
        users.findOneAndUpdate({username: req.session.user},{$set:{'name':user,'username':username,'email':email,'gender':gender,'age':age,'height':height,'weight':weight, 'password':hash, 'calories':calories}}, function (err, user) {
            if (err) {
                console.log("something went wrong: " + err);
                return res.status(500).send("Error updating account.");
            }
            user_food.update({user_id: req.session.user_id},{$set:{'calories':calories}},{multi: true}, function (err, result) {
                if(err){
                    console.log("err " + err);
                }
                else{
                    console.log(result);
                    return res.status(200).send('Account updated.');
                }
            });
        });
        
    });

    /********************************
    Log out
    ********************************/

    app.get('/account/logout', function (req, res) {
        req.session.destroy();

        if(!req.session){
            return res.status(200).send(req.session);
        }
        return res.status(401).send("Please log in.");
        return res.status(200).send('response');
    });

    /********************************
    Progress page
    ********************************/

    app.get('/account/progress', function (req, res) {

        //find all user food diaries, group by date and add up total cals per day
        user_food.aggregate({$match:{user_id:mongoose.Types.ObjectId(req.session.user_id)}},{$project: {date:1,calories:{$add:[
                            {$reduce: {input: "$breakfast",initialValue: 0,in: { $add : ["$$value", "$$this.calories"]}}}, 
                            {$reduce: {input: "$lunch",initialValue: 0,in: { $add : ["$$value", "$$this.calories"]}}},
                            {$reduce: {input: "$snacks",initialValue: 0,in: { $add : ["$$value", "$$this.calories"]}}},
                            {$reduce: {input: "$dinner",initialValue: 0,in: { $add : ["$$value", "$$this.calories"]}}}]}}}, function (err, results) {
            //if the user exists
            if (err) {
                console.log("something went wrong: " + err);
                return res.status(500).send(err);
            } else {
                return res.status(200).send(results);
            }
        });
    });
    
    /********************************
    User Diary Page
    ********************************/
    
var today = parseInt(JSON.stringify(new DateOnly));
    
    app.get('/account/diary', function (req, res) {

        //check if the user is logged in
        if (!req.session.user) {
            res.status(401).send("Please log in.");
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
    
    app.post('/account/textsearch', function (req, res) {
        //check if the user is logged in
        if (!req.session.user) {
            res.status(401).send("Please log in.");
        }
        // meal selected into usable mongoose variable
        var meal = "$"+req.body.meal;
        // formatted into a sprt method
        var sort = meal+".name";
        
        //Most popular items for the specified meal
        user_food.aggregate([{$match:{user_id:mongoose.Types.ObjectId(req.session.user_id)}},{$unwind: meal}, {$group:{_id: sort,[req.body.meal]:{$first:meal},count:{$sum:1}}}, {$sort:{count:-1}},{$limit:5}], function(err, results) {
            if (err) {
                console.log("something went wrong: " + err);
                return res.status(500).send(err);
            } else {
                return res.status(200).send(results);
            }
        });
    }); 
    
    app.get('/account/custom', function (req, res) { 
        //Most popular items for the specified meal
        users.find({username: req.session.user},{'customs': 1}, function(err, results) {
            if (err) {
                console.log("something went wrong: " + err);
                return res.status(500).send(err);
            } else {
                return res.status(200).send(results);
            }
        });
    });
    
    //add single food item
    app.post('/account/diary', function (req, res) {
        
        // getting the meal name so that i can use it to post the food data to the collect object array
        var meal = Object.keys(req.body).shift();
        
        // getting the foods to then add to the array
        var food = req.body[Object.keys(req.body)].shift();
        food.id = new ObjectID();
        
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
        
        var meal = req.body.meal + '.name';
        var mealLimit = req.body.meal + '.$';
        var food = req.body.food;

        // search for an entry with todays date 
        user_food.findOne({user_id : req.session.user_id, date: today,[meal]: food},{[mealLimit] : 1},function(err, item){
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
        var nutrients = {protein:req.body.protein, carbs:req.body.carbs, fat: req.body.fats};
  
        var query = meal+'.id';
        var queryCal = meal+".$.calories";
        var queryServ = meal+".$.servings";
        var queryNut = meal+".$.nutrients";
        
        // search for an entry with todays date, meal, food and update the entry
        user_food.update({user_id:mongoose.Types.ObjectId(req.session.user_id), date: today, [query]: mongoose.Types.ObjectId(req.body.id)}, {$set: {[queryCal]: calories,[queryServ]: serving,[queryNut]: nutrients}},function(err, other){
            if(err){
                console.log(err);
                return res.status(500).send(err);
            }
            else{
                console.log(other);
                return res.status(200).send(other);
            }
        });
        
    });
        
    //add meal to custom meal in user table
    app.post('/account/food/custom', function (req, res) {
        
        console.log(req.body);
        //get the meal to be added
        var meal = req.body;

        // search for the user and add the data to their custome field
        users.findOneAndUpdate({username : req.session.user}, {$push: {'customs': meal}}, function(err, other){
            if(err){
                console.log("something went wrong: " + err);
                return res.status(500).send(err);
            }
            else{
                return res.status(200).send(other);
            }
        });

    });  
    
    //delete meal from custom in user table
    app.post('/account/food/deletecustom', function (req, res) {
        
        console.log(req.body);
        //get the meal to be deleted
        var meal = req.body;

        // search for the user and delte the data from their custome field
        users.findOneAndUpdate({username : req.session.user}, {$pull: {'customs': meal}}, function(err, other){
            if(err){
                console.log("something went wrong: " + err);
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
        //get the food that needs to be deleted by its unique id
        var id = req.body.id;

        // search for an entry with todays date, meal, food and pull from the entry
        user_food.update({user_id :mongoose.Types.ObjectId(req.session.user_id), date: today}, {$pull: {[meal]:{id:mongoose.Types.ObjectId(id)}}}, function(err, other){
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