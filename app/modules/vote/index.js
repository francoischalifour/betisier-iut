'use strict';

var express = require('express');
var VoteController = require('./vote.controller');

/**
 * Creates the express router.
 *
 * @type {object}
 */
var router = express.Router()

/**
 * Declares route names.
 */
router.get('/:id/delete', VoteController.Delete);

/**
 * Exports configured router.
 *
 * @type {object}
 */
module.exports = router;
