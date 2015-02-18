'use strict';

/*
 * VOTE
 * cit_num
 * per_num
 * vot_valeur
 */

/**
 * Imports database connection.
 *
 * @type {object}
 * @private
 */
var db = require('../../../dbConfig');

/**
 * Gets all votes.
 *
 * @param  {function} callback
 * @return a list of votes
 */
module.exports.getAllVote = function(callback) {
    db.getConnection(function(err, connection) {
        if (!err) {
            var req;
            req = 'SELECT cit_num, per_num, vot_valeur ';
            req += 'FROM vote ';
            req += 'ORDER BY vot_valeur ASC'
            connection.query(req, callback);
            connection.release();
        }
    });
}
