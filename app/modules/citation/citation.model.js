'use strict';

/*
 * CITATION
 * cit_num
 * per_num
 * per_num_valide
 * per_num_etu
 * cit_libelle
 * cit_date
 * cit_valide
 * cit_date_valide
 * cit_date_depo
 */

/**
 * Imports database connection.
 *
 * @type {object}
 * @private
 */
var db = require('../../../config/database');

/**
 * Gets all citations when logged as a user.
 *
 * @param  {function} callback
 * @return a list of citations
 */
module.exports.getAllCitation = function(callback) {
    db.getConnection(function(err, connection) {
        if (!err) {
            var req;
            req = 'SELECT c.cit_num, cit_libelle, DATE_FORMAT(cit_date, "%d/%m/%Y") as cit_date, per_prenom, per_nom, p.per_num, AVG(vot_valeur) AS vot_valeur ';
            req += 'FROM citation c ';
            req += 'INNER JOIN personne p ON p.per_num = c.per_num ';
            req += 'LEFT JOIN vote v ON v.cit_num = c.cit_num ';
            req += 'WHERE cit_valide = 1 AND cit_date_valide IS NOT NULL ';
            req += 'GROUP BY c.cit_num '
            req += 'ORDER BY cit_date_valide DESC'

            connection.query(req, callback);
            connection.release();
        }
    });
}

/**
 * Gets all citations when logged as an admin.
 *
 * @param  {function} callback
 * @return a list of citations
 */
module.exports.getAllCitationEnAttente = function(callback) {
    db.getConnection(function(err, connection) {
        if (!err) {
            var req;
            req = 'SELECT c.cit_num, cit_libelle, DATE_FORMAT(cit_date, "%d/%m/%Y") as cit_date, cit_date_valide, cit_valide, per_prenom, per_nom, p.per_num, AVG(vot_valeur) AS vot_valeur ';
            req += 'FROM citation c ';
            req += 'INNER JOIN personne p ON p.per_num = c.per_num ';
            req += 'LEFT JOIN vote v ON v.cit_num = c.cit_num ';
            req += 'WHERE cit_valide = 0 OR cit_date_valide IS NULL ';
            req += 'GROUP BY c.cit_num '
            req += 'ORDER BY cit_date ASC'

            connection.query(req, callback);
            connection.release();
        }
    });
}

/**
 * Gets all citation dates.
 *
 * @param  {function} callback
 * @return a list of dates
 */
module.exports.getAllDate = function(callback) {
    db.getConnection(function(err, connection) {
        if (!err) {
            var req;
            req = 'SELECT DISTINCT DATE_FORMAT(cit_date, "%d/%m/%Y") as cit_date ';
            req += 'FROM citation ';
            req += 'WHERE cit_valide = 1 ';
            req += 'ORDER BY cit_date DESC';

            connection.query(req, callback);
            connection.release();
        }
    });
}

/**
 * Gets citation by ID.
 *
 * @param  {function} callback
 * @return the citation
 */
module.exports.getCitationById = function(cit_num, callback) {
    db.getConnection(function(err, connection) {
        if (!err) {
            var req;
            req = 'SELECT cit_libelle, c.per_num, per_nom, per_prenom ';
            req += 'FROM citation c ';
            req += 'INNER JOIN personne p ON p.per_num = c.per_num ';
            req += 'WHERE cit_num = ? ';

            connection.query(req, [cit_num], callback);
            connection.release();
        }
    });
}

/**
 * Gets last citation.
 *
 * @param  {function} callback
 * @return the last citation
 */
module.exports.getLastCitation = function(callback) {
    db.getConnection(function(err, connection) {
        if (!err) {
            var req;
            req = 'SELECT cit_libelle ';
            req += 'FROM citation c ';
            req += 'WHERE cit_valide = 1 ';
            req += 'ORDER BY cit_date DESC ';
            req += 'LIMIT 1';

            connection.query(req, callback);
            connection.release();
        }
    });
}

/**
 * Gets all moyennes.
 *
 * @param  {function} callback
 * @return a list of moyennes
 */
module.exports.getAllMoyenne = function(callback) {
    db.getConnection(function(err, connection) {
        if (!err) {
            var req;
            req = 'SELECT AVG(vot_valeur) AS vot_valeur ';
            req += 'FROM citation c ';
            req += 'INNER JOIN vote v ON v.cit_num = c.cit_num ';
            req += 'WHERE cit_valide = 1 ';
            req += 'GROUP BY c.cit_num ';
            req += 'ORDER BY vot_valeur ASC'

            connection.query(req, callback);
            connection.release();
        }
    });
}

/**
 * Adds a citation.
 *
 * @param {object}   data Citation data
 * @param {function} callback
 */
module.exports.addCitation = function(data, callback) {
    db.getConnection(function(err, connection) {
        if (!err) {
            connection.query('INSERT INTO citation SET ?', data, callback);
            connection.release();
        }
    });
}

/**
 * Deletes a citation.
 *
 * @param  {number}   cit_num  Citation id
 * @param  {function} callback
 */
module.exports.deleteCitation = function(cit_num, callback) {
    db.getConnection(function(err, connection) {
        if (!err) {
            var req, req2;
            req = 'DELETE FROM vote WHERE cit_num = ?';
            req2 = 'DELETE FROM citation WHERE cit_num = ?';

            connection.query(req, [cit_num], callback);
            connection.query(req2, [cit_num], callback);
            connection.release();
        }
    });
}

/**
 * Validates a citation.
 *
 * @param {object}   data Citation data
 * @param {function} callback
 */
module.exports.validateCitation = function(per_num, cit_num, callback) {
    db.getConnection(function(err, connection) {
        if (!err) {
            var req;
            var date = new Date();
            req = 'UPDATE citation ';
            req += 'SET per_num_valide = ?, cit_valide = 1, cit_date_valide = ? ';
            req += 'WHERE cit_num = ?';

            connection.query(req, [per_num, date, cit_num], callback);
            connection.release();
        }
    });
}

/**
 * Searches for a citation.
 *
 * @param  {string}   search   String we are searching for
 * @param  {function} callback
 */
module.exports.searchCitation = function(data, callback) {
    db.getConnection(function(err, connection) {
        var req;
        req = 'SELECT c.cit_num, cit_libelle, DATE_FORMAT(cit_date, "%d/%m/%Y") as cit_date, cit_date_valide, cit_valide, per_prenom, per_nom, p.per_num, AVG(vot_valeur) as vot_valeur ';
        req += 'FROM citation c ';
        req += 'LEFT JOIN personne p ON p.per_num = c.per_num ';
        req += 'LEFT JOIN vote v ON v.cit_num = c.cit_num ';
        req += 'WHERE cit_valide = 1 ';

        if (data.search)
            req += 'AND cit_libelle LIKE ' + connection.escape('%' + data.search + '%') + ' ';

        if (data.per_num && data.per_num != 0)
            req += 'AND p.per_num = ' + data.per_num + ' ';

        if (data.cit_date && data.cit_date != 0) {
            var cit_date = data.cit_date.split('/');
            var cit_date = connection.escape(cit_date[2] + '-' + cit_date[1] + '-' + cit_date[0]);
            req += 'AND cit_date = ' + cit_date + ' ';
        }

        if (data.vot_valeur && data.vot_valeur != 0)
            req += 'AND vot_valeur BETWEEN ' + (parseInt(data.vot_valeur) - 1) + ' AND ' + (parseInt(data.vot_valeur) + 1) + ' ' ;

        req += 'GROUP BY c.cit_num '
        req += 'ORDER BY cit_date DESC';

        console.log(req);

        connection.query(req, callback);
        connection.release();
    });
}

/**
 * Notes a citation.
 *
 * @param {object}   data Citation data
 * @param {function} callback
 */

module.exports.noteCitation = function(data, callback) {
    db.getConnection(function(err, connection) {
        if (!err) {
            connection.query('INSERT INTO vote SET ?', data, callback);
            connection.release();
        }
    });
}

/**
 * Checks if the current user has already voted the citation.
 *
 * @param  {object}   cit_num
 * @param  {object}   per_num
 * @param  {function} callback [description]
 * @return {boolean} true if has, false if has not
 */
module.exports.hasAlreadyVoted = function(cit_num, per_num, callback) {
    db.getConnection(function(err, connection) {
        if (!err) {
            connection.query('SELECT COUNT(*) AS hasAlready FROM vote WHERE cit_num = ? AND per_num = ?', [cit_num, per_num], callback);
            connection.release();
        }
    });
}
