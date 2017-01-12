'use strict';
// Dependencies
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var morgan = require('morgan');

// Configs
var db = require('./config/db');

mongoose.Promise = global.Promise;
// Connect to the DB
mongoose.connect(db.url);

// Initialize the Express App
var app = express();

// Configure 

// To expose public assets to the world
app.use(express.static(__dirname + '/public'));

// log every request to the console
app.use(morgan('dev'));

// For parsing HTTP responses
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Express Routes
require('./app/routes/api')(app);
require('./app/routes/routes')(app);

// Start the app with listen and a port number
app.listen(6001);
