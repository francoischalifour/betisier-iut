'use strict';

/*
 * FONCTION
 * fon_num
 * fon_libelle
 */

/**
 * Imports database connection.
 *
 * @type {object}
 * @private
 */
var db = require('../../../config/database');

/**
 * Gets all fonctions.
 *
 * @param  {function} callback
 * @return a list of fonctions
 */
module.exports.getAllFonction = function(callback) {
    db.getConnection(function(err, connection) {
            var req;
        req = 'SELECT fon_num, fon_libelle ';
        req += 'FROM fonction ';
        req += 'ORDER BY fon_libelle ASC';
        connection.query(req, callback);
        connection.release();
    });
}
