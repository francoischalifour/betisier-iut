'use strict';

/*
 * SALARIE
 * @extends personne
 * per_num
 * sal_telprof
 * fon_num
 */

/**
 * Imports database connection.
 *
 * @type {object}
 * @private
 */
var db = require('../../../../config/database');

/**
 * Gets all salarie.
 *
 * @param  {function} callback
 * @return a list of salaries
 */
module.exports.getAllSalarie = function(callback) {
    db.getConnection(function(err, connection) {
        if (!err) {
            var req;
            req = 'SELECT p.per_num, per_prenom, per_nom ';
            req += 'FROM personne p ';
            req += 'INNER JOIN salarie s ON s.per_num = p.per_num '
            req += 'ORDER BY per_prenom, per_nom ASC'
            connection.query(req, callback);
            connection.release();
        }
    });
}

/**
 * Gets a salarie given by its id.
 *
 * @param  {number}   per_num  Person's id
 * @param  {function} callback
 * @return a salarie
 */
module.exports.getSalarieById = function(per_num, callback) {
    db.getConnection(function(err, connection) {
        if (!err) {
            var req;
            req = 'SELECT per_num, sal_telprof, fon_num ';
            req += 'FROM salarie ';
            req += 'WHERE per_num = ?';
            connection.query(req, [per_num], callback);
            connection.release();
        }
    });
}
