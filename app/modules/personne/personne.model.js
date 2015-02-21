'use strict';

/*
 * PERSONNE
 * per_num
 * per_nom
 * per_prenom
 * per_tel
 * per_mail
 * per_admin
 * per_login
 * per_pwd
 */

/**
 * Calls the crypto module to crypt the password.
 *
 * @type {obect}
 * @private
 */
var crypto = require('crypto');

/**
 * Imports database connection.
 *
 * @type {object}
 * @private
 */
var db = require('../../../dbConfig');

/**
 * Gets all persons.
 *
 * @param  {function} callback
 * @return a list of persons
 */
module.exports.getAllPersonne = function(callback) {
    db.getConnection(function(err, connection) {
        if (!err) {
            var req;
            req = 'SELECT per_num, per_prenom, per_nom ';
            req += 'FROM personne ';
            req += 'ORDER BY per_prenom, per_nom ASC';
            connection.query(req, callback);
            connection.release();
        }
    });
}

/**
 * Gets a person given by its id.
 *
 * @param  {number}   per_num  Id of the person
 * @param  {function} callback
 * @return a person
 */
module.exports.getPersonneById = function(per_num, callback) {
    db.getConnection(function(err, connection) {
        if (!err) {
            var req;
            req = 'SELECT per_prenom, per_nom, per_tel, per_mail, per_admin, fon_libelle, vil_nom, dep_nom, sal_telprof ';
            req += 'FROM personne p ';
            req += 'LEFT JOIN etudiant e ON e.per_num = p.per_num ';
            req += 'LEFT JOIN departement d ON d.dep_num = e.dep_num ';
            req += 'LEFT JOIN ville v ON v.vil_num = d.vil_num ';
            req += 'LEFT JOIN salarie s ON s.per_num = p.per_num ';
            req += 'LEFT JOIN fonction f ON f.fon_num = s.fon_num ';
            req += 'WHERE p.per_num = ' + connection.escape(per_num);
            connection.query(req, callback);
            connection.release();
        }
    });
}

/**
 * Adds a person.
 *
 * @param {object}   data     Person data
 * @param {function} callback
 */
module.exports.addPersonne = function(data, typePers, callback) {
    db.getConnection(function(err, connection) {
        if (!err) {
            var req;

            req = 'INSERT INTO personne ';
            req += '(per_nom, per_prenom, per_tel, per_mail, per_login, per_pwd) ';
            req += 'VALUES (' + data['per_nom'] + ', ' + data['per_prenom'] + ', ' + data['per_tel'] + ', ' + data['per_mail'] + ', ' + data['per_login'] + ', ' + data['per_pwd'] + ')';

            connection.query(req, data, callback);

            if (typePers === 0) {
                req = 'INSERT INTO etudiant ';
                req += '(per_num, dep_num, div_num) ';
                req += 'VALUES (' + data['per_num'] + ', ' + data['dep_num'] + ', ' + data['div_num'] + ')';
            } else {
                req = 'INSERT INTO salarie ';
                req += '(per_num, dep_num, div_num) ';
                req += 'VALUES (' + data['per_num'] + ', ' + data['sal_telprof'] + ', ' + data['fon_num'] + ')';
            }

            connection.query(req, data, callback);

            connection.release();
        }
    });
}

/**
 * Checks the login and password.
 *
 * @param  {object}   data     User data (login and password)
 * @param  {function} callback
 * @return  user id if password and login match
 */
module.exports.checkLogin = function(data, callback) {
    db.getConnection(function(err, connection) {
        if (!err) {
            var sha256 = crypto.createHash('sha256');
            sha256.update(data.password, 'utf8');
            var password = sha256.digest('base64'); // Password with sha256
            var req;

            req = 'SELECT per_num, per_admin FROM personne WHERE per_login = ' + connection.escape(data.login) + ' AND per_pwd = ' + connection.escape(password);
            connection.query(req, callback);
            connection.release();
        }
    });
}
