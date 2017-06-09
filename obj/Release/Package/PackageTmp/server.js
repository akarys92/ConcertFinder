/**
 * An app for recommending concerts to Spotify users based on their listening habits
 */

// External imports
var express = require('express');
var request = require('request');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Create an express app
var app = express();

// Use middleware
app.use(cookieParser());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Routes 
var spotify_routes = require('./routes/spotify_routes');
var event_routes = require('./routes/event_routes');

app.use('/spotify', spotify_routes);
app.use('/events', event_routes);

// Load Static
app.use(express.static(__dirname + '/public'))
    .use(cookieParser());

/**************************************************************** */
var port = process.env.ENVKEY ? process.env.PORT : 8888;
console.log('Listening on 8888');
app.listen(port);