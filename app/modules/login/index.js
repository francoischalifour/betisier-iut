'use strict';

var express = require('express');
var LoginController = require('./login.controller');

/**
 * Creates the express router.
 *
 * @type {object}
 */
var router = express.Router()

/**
 * Declares route names.
 */
router.get('/login', LoginController.Login);
router.post('/login', LoginController.Login);
router.get('/logout', LoginController.Logout);

/**
 * Exports configured router.
 *
 * @type {object}
 */
module.exports = router;