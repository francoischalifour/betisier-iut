'use strict';

var express = require('express');
var PersonneController = require('./personne.controller');

/**
 * Creates the express router.
 *
 * @type {object}
 */
var router = express.Router()

/**
 * Declares route names.
 */
router.get('/all', PersonneController.List);
router.get('/create', PersonneController.Create);
router.post('/create', PersonneController.Create);
router.get('/:id/edit', PersonneController.Edit);
router.post('/:id/edit', PersonneController.Edit);
router.get('/:id', PersonneController.View);
router.get('/:id/delete', PersonneController.Delete);

/**
 * Exports configured router.
 *
 * @type {object}
 */
module.exports = router;
