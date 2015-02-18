'use strict';

/*
 * VILLE
 * vil_num
 * vil_nom
 */

/**
 * Imports database connection.
 *
 * @type {object}
 * @private
 */
var db = require('../../../dbConfig');

/**
 * Gets all cities.
 *
 * @param {function} callback
 * @return a list of cities
 */
module.exports.getAllVille = function(callback) {
    db.getConnection(function(err, connection) {
        if (!err) {
            var req;
            req = 'SELECT vil_num, vil_nom ';
            req += 'FROM ville ';
            req += 'ORDER BY vil_nom ASC'
            connection.query(req, callback);
            connection.release();
        }
    });
}

/**
 * Returns a city given by its id.
 *
 * @param  {function} callback
 * @return the city
 */
module.exports.getVilleById = function(vil_num, callback) {
    db.getConnection(function(err, connection) {
        if (!err) {
            var req;
            req = 'SELECT vil_num, vil_nom ';
            req += 'FROM ville ';
            req += 'WHERE vil_num = ' + connection.escape(vil_num);
            connection.query(req, callback);
            connection.release();
        }
    });
}

/**
 * Adds a city.
 *
 * @param {string} vil_nom Ville's name
 * @param {function} callback
 */
module.exports.addVille = function(vil_nom, callback) {
    db.getConnection(function(err, connection) {
        if (!err) {
            connection.query('INSERT INTO ville SET vil_nom = ' + connection.escape(vil_nom), callback);
            connection.release();
        }
    });
}

/**
 * Edits a city.
 *
 * @param {number} vil_num Ville's number
 * @param {string} vil_nom Ville's name
 * @param {function} callback
 */
module.exports.editVille = function(vil_num, vil_nom, callback) {
    db.getConnection(function(err, connection) {
        if (!err) {
            var req;
            req = 'UPDATE ville ';
            req += 'SET vil_nom = ' + connection.escape(vil_nom) + ' ';
            req += 'WHERE vil_num = ' + connection.escape(vil_num);
            connection.query(req, callback);
            connection.release();
        }
    });
}


/**
 * Deletes a city.
 *
 * @param {number} vil_num Ville's number
 * @param {function} callback
 */
module.exports.deleteVille = function(vil_num, callback) {
    db.getConnection(function(err, connection) {
        if (!err) {
            var req;
            req = 'DELETE FROM ville ';
            req += 'WHERE vil_num = ' + connection.escape(vil_num);
            connection.query(req, callback);
            connection.release();
        }
    });
}
