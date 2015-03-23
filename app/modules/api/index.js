'use strict';

var express = require('express');
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
router.get('/citations/:id', CitationController.Get);
router.get('/mots/forbidden', CitationController.ForbiddenWords);

/**
 * Exports configured router.
 *
 * @type {object}
 */
module.exports = router;
