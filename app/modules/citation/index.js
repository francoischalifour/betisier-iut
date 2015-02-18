'use strict';

var express = require('express');
var CitationController = require('./citation.controller');

/**
 * Creates the express router.
 *
 * @type {object}
 */
var router = express.Router()

/**
 * Declares route names.
 */
router.get('/all', CitationController.List);
router.get('/create', CitationController.Create);
router.post('/create', CitationController.Create);
router.get('/:id/delete', CitationController.Delete);
router.get('/search', CitationController.Search);
router.post('/search', CitationController.Search);

/**
 * Exports configured router.
 *
 * @type {object}
 */
module.exports = router;
