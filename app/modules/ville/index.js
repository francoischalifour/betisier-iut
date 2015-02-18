'use strict';

var express = require('express');
var VilleController = require('./ville.controller');

/**
 * Creates the express router.
 *
 * @type {object}
 */
var router = express.Router()

/**
 * Declares route names.
 */
router.get('/all', VilleController.List);
router.get('/create', VilleController.Create);
router.post('/create', VilleController.Create);
router.get('/:id/edit', VilleController.Edit)
router.post('/:id/edit', VilleController.Edit)
router.get('/:id/delete', VilleController.Delete);

/**
 * Exports configured router.
 *
 * @type {object}
 */
module.exports = router;