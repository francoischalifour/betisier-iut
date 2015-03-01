'use strict';

/*
 * MOT
 * mot_id
 * mot_interdit
 */

/**
 * Imports database connection.
 *
 * @type {object}
 * @private
 */
var db = require('../../../config/database');

/**
 * Gets all forbidden words.
 *
 * @param  {function} callback
 * @return a list of fobidden words
 */
module.exports.getAllMot = function(callback) {
    db.getConnection(function(err, connection) {
        if (!err) {
            var req;
            req = 'SELECT mot_id, mot_interdit ';
            req += 'FROM mot ';
            req += 'ORDER BY mot_interdit ASC';
            connection.query(req, callback);
            connection.release();
        }
    });
}
