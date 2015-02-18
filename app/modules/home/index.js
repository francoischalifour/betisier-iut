'use strict';

var express = require('express');
var HomeController = require('./home.controller');

/**
 * Creates the express router.
 *
 * @type {object}
 */
var router = express.Router()

/**
 * Declares route names.
 */
router.get('/', HomeController.View);

/**
 * Exports configured router.
 *
 * @type {object}
 */
module.exports = router;