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
var db = require('../../../config/database');

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
            req += 'ORDER BY vot_valeur ASC';

            connection.query(req, callback);
            connection.release();
        }
    });
}


/**
 * Gets all votes.
 *
 * @param  {function} callback
 * @return a list of votes
 */
module.exports.getVoteByCitationId = function(cit_num, callback) {
    db.getConnection(function(err, connection) {
        if (!err) {
            var req;
            req = 'SELECT p.per_num, per_prenom, per_nom, vot_valeur ';
            req += 'FROM vote v ';
            req += 'INNER JOIN personne p ON p.per_num = v.per_num '
            req += 'WHERE cit_num = ?';

            connection.query(req, [cit_num], callback);
            connection.release();
        }
    });
}
