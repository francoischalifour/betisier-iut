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
var db = require('../../../dbConfig');

/**
 * Gets all citations.
 *
 * @param  {function} callback
 * @return a list of citations
 */
module.exports.getAllCitation = function(callback) {
    db.getConnection(function(err, connection) {
        if (!err) {
            // TODO : ajouter le cit_date_valide IS NOT NULL
            var req;
            req = 'SELECT c.cit_num, cit_libelle, DATE_FORMAT(cit_date, "%d/%m/%Y") as cit_date, cit_date_valide, cit_valide, per_prenom, per_nom, p.per_num, AVG(vot_valeur) AS vot_valeur ';
            req += 'FROM citation c ';
            req += 'INNER JOIN personne p ON p.per_num = c.per_num ';
            req += 'LEFT JOIN vote v ON v.cit_num = c.cit_num ';
            req += 'WHERE cit_valide = 1 ';
            req += 'GROUP BY c.cit_num '
            req += 'ORDER BY cit_date ASC '
            connection.query(req, callback);
            connection.release();
        }
    })
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
 * Gets all moyennes.
 *
 * @param  {function} callback
 * @return a list of moyennes
 */
module.exports.getAllMoyenne = function(callback) {
    db.getConnection(function(err, connection) {
        if (!err) {
            var req;
            req = 'SELECT AVG(vot_valeur) as vot_valeur ';
            req += 'FROM citation c ';
            req += 'INNER JOIN vote v ON v.cit_num = c.cit_num ';
            req += 'WHERE cit_valide = 1 ';
            req += 'GROUP BY c.cit_num '
                //req += 'ORDER BY vot_valeur DESC '
            connection.query(req, callback);
            connection.release();
        }
    })
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
            console.log(data);
            data['cit_date'] = 'STR_TO_DATE("' + data.cit_date + '", "%Y-%m-%d")';
            console.log(data.cit_date);
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
            req = 'DELETE FROM vote WHERE cit_num = ' + connection.escape(cit_num);
            req2 = 'DELETE FROM citation WHERE cit_num = ' + connection.escape(cit_num);
            connection.query(req, callback);
            connection.query(req2, callback);
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
    //TODO Problème recherche (champ vide)
    db.getConnection(function(err, connection) {
        var search = data.search;
        var per_num = data.per_num;
        var cit_date = data.cit_date;
        var vot_valeur = data.vot_valeur;

        var req;
        req = 'SELECT c.cit_num, cit_libelle, DATE_FORMAT(cit_date, "%d/%m/%Y") as cit_date, cit_date_valide, cit_valide, per_prenom, per_nom, p.per_num, AVG(vot_valeur) as vot_valeur ';
        req += 'FROM citation c ';
        if (per_num && per_num != 0)
            req += 'INNER JOIN personne p ON p.per_num = c.per_num ';
        if (vot_valeur && vot_valeur != 0)
            req += 'INNER JOIN vote v ON v.cit_num = c.cit_num ';
        req += 'WHERE cit_valide = 1 ';
        if (search)
            req += 'AND cit_libelle LIKE ' + connection.escape("%" + search + "%") + ' ';
        if (per_num && per_num != 0)
            req += 'AND p.per_num = ' + connection.escape(per_num) + ' ';
        if (cit_date && cit_date != 0)
            req += 'AND cit_date = STR_TO_DATE(' + connection.escape(cit_date) + , "%Y-%m-%d") ';
        if (vot_valeur && vot_valeur != 0)
            req += 'AND vot_valeur = ' + connection.escape(vot_valeur) + ' ';
        req += 'GROUP BY c.cit_num '
        req += 'ORDER BY cit_date DESC ';

        console.log(req);

        connection.query(req, callback);
        connection.release();
    });
}
