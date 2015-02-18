'use strict';

/**
 * Imports HTTP module.
 *
 * @type {object}
 */
var http = require('http');

var path = require('path');

/**
 * Imports Express framework.
 *
 * @type {object}
 */
var express = require('express');

/**
 * Creates app using Express.
 *
 * @type {object}
 * @private
 */
var app = express();

/*
 * Declares static routes.
 */
app.use(express.static(path.join(__dirname + '/public/')));

require('./config/express')(app);

/*
 * Starts the server.
 */
http.createServer(app).listen(app.get('port'), function() {
    console.log('Listening on port ' + app.get('port') + '...');
})
