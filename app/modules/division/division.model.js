'use strict';

/*
 *  DIVISION
 *  div_num
 *  div_nom
 */

/**
 * Imports database connection.
 *
 * @type {object}
 * @private
 */
var db = require('../../../config/database');

/**
 * Gets all divisions.
 *
 * @param  {function} callback
 * @return a list of divisions
 */
module.exports.getAllDivision = function(callback) {
    db.getConnection(function(err, connection) {
        if (!err) {
            var req;
            req = 'SELECT div_num, div_nom ';
            req += 'FROM division ';
            req += 'ORDER BY div_nom ASC';
            connection.query(req, callback);
            connection.release();
        }
    });
}
