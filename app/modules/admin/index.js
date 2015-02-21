'use strict';

var express = require('express');
var AdminController = require('./admin.controller');
var CitationController = require('../citation/citation.controller');

/**
 * Creates the express router.
 *
 * @type {object}
 */
var router = express.Router()

/**
 * Declares route names.
 */
router.get('/', AdminController.View);
router.get('/citations/all', CitationController.ListAdmin);

/**
 * Exports configured router.
 *
 * @type {object}
 */
module.exports = router;
