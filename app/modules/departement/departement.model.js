'use strict';

/*
 * DEPARTEMENT
 * dep_num
 * dep_nom
 * vil_num
 */

/**
 * Imports database connection.
 *
 * @type {object}
 * @private
 */
var db = require('../../../dbConfig');

/**
 * Gets all departements.
 *
 * @param  {function} callback
 * @return a list of departements
 */
module.exports.getAllDepartement = function(callback) {
    db.getConnection(function(err, connection) {
        if (!err) {
            var req;
            req = 'SELECT dep_num, dep_nom, vil_num ';
            req += 'FROM departement ';
            req += 'ORDER BY dep_nom ASC'
            connection.query(req, callback);
            connection.release();
        }
    });
}
