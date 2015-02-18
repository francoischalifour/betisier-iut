'use strict';

/*
 * Loads dependencies.
 *
 *     - express pour le serveur
 *     - path pour la gestion de l'arborescence
 *     - body-parser pour parser les requêtes
 *     - handlebars pour le moteur de template.
 */
var express = require('express');
var session = require('express-session');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var handlebars = require('express-handlebars');

/**
 * Exports Express configuration.
 * @param  {object} app
 */
module.exports = function(app) {
    /*
     * Configures the server.
     */
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.set('port', 6800);
    app.set('views', path.join(__dirname, '../app/modules'));

    app.use(cookieParser());

    app.use(session({
        secret: 'nC0@#1pM/-0qA1+é',
        name: 'betisier',
        resave: true,
        saveUninitialized: true
    }));

    /**
     * Loads all routes.
     *
     * @type {object}
     * @private
     */
    var router = require('../router')(app);

    /*
     * Configures handlebars.
     */
    app.engine('html', handlebars({
        extname: 'html',
        defaultLayout: '../../app/layouts/main',
        partialsDir: [
            'app/partials/'
        ]
    }));

    app.set('view engine', 'html');
}
