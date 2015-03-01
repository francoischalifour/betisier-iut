'use strict';

/*
 * ETUDIANT
 * @extends personne
 * per_num
 * dep_num
 * div_num
 */

/**
 * Imports database connection.
 *
 * @type {object}
 * @private
 */
var db = require('../../../config/database');

/**
 * Gets a student given by its id.
 *
 * @param  {number}   per_num  Person's id
 * @param  {function} callback
 * @return a student
 */
module.exports.getEtudiantById = function(per_num, callback) {
    db.getConnection(function(err, connection) {
        if (!err) {
            var req;
            req = 'SELECT per_num, dep_num, div_num ';
            req += 'FROM etudiant ';
            req += 'WHERE per_num = ?';
            connection.query(req, [per_num], callback);
            connection.release();
        }
    });
}