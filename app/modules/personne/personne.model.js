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
var db = require('../../../config/database');

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
            req = 'SELECT p.per_num, per_prenom, per_nom, per_tel, per_mail, per_admin, fon_libelle, vil_nom, dep_nom, sal_telprof ';
            req += 'FROM personne p ';
            req += 'LEFT JOIN etudiant e ON e.per_num = p.per_num ';
            req += 'LEFT JOIN departement d ON d.dep_num = e.dep_num ';
            req += 'LEFT JOIN ville v ON v.vil_num = d.vil_num ';
            req += 'LEFT JOIN salarie s ON s.per_num = p.per_num ';
            req += 'LEFT JOIN fonction f ON f.fon_num = s.fon_num ';
            req += 'WHERE p.per_num = ?';
            connection.query(req, [per_num], callback);
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
            var sha256 = crypto.createHash('sha256');
            sha256.update(data.per_pwd, 'utf8');
            var password = sha256.digest('base64'); // Crypted password

            var personne = {
                per_nom: data.per_nom,
                per_prenom: data.per_prenom,
                per_tel: data.per_tel,
                per_mail: data.per_mail,
                per_login: data.per_login,
                per_pwd: password
            };

            // Add the person.
            connection.query('INSERT INTO personne SET ?', personne, function(err, result) {
                if (!err) {
                    var lastId = result.insertId;

                    // Add the étudiant or the salarié (0 for étudiant, 1 for salarié).
                    if (parseInt(typePers) === 0) {
                        var etudiant = {
                            per_num: lastId,
                            dep_num: data.dep_num,
                            div_num: data.div_num
                        };

                        connection.query('INSERT INTO etudiant SET ?', etudiant, callback);
                    } else {
                        var salarie = {
                            per_num: lastId,
                            sal_telprof: data.sal_telprof,
                            fon_num: data.fon_num
                        };

                        connection.query('INSERT INTO salarie SET ?', salarie, callback);
                    }
                }
            });

            connection.release();
        }
    });
}

/**
 * Checks if the login already exists.
 * @param  {string}   per_login Login of the new person
 * @param  {function} callback
 * @return {boolen} true if the login already exists, false if not
 */
module.exports.loginHasAlreadyBeTaken = function(per_login, callback) {
    db.getConnection(function(err, connection) {
        if (!err) {
            connection.query('SELECT COUNT(*) AS hasAlready FROM personne WHERE per_login = ?', [per_login], callback);
            connection.release();
        }
    });
}

/**
 * Deletes a person.
 *
 * @param  {number}   per_num  Id of the person to delete
 * @param  {function} callback
 */
module.exports.deletePersonne = function(per_num, callback) {
    db.getConnection(function(err, connection) {
        if (!err) {
            connection.query('SELECT per_num FROM etudiant WHERE per_num = ?', [per_num], function(err, result) {
                if (!err) {
                    // If this is a Etudiant.
                    if (result.length === 1)
                        connection.query('DELETE FROM etudiant WHERE per_num = ?', [per_num], callback);
                    else
                        connection.query('DELETE FROM salarie WHERE per_num = ?', [per_num], callback);

                    // Delete the person.
                    connection.query('DELETE FROM personne WHERE per_num = ?', [per_num], callback);
                }
            });

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
            var password = sha256.digest('base64'); // Crypted password
            var req;

            req = 'SELECT per_num, per_admin ';
            req += 'FROM personne ';
            req += 'WHERE per_login = ? AND per_pwd = ?';
            connection.query(req, [data.login, password], callback);
            connection.release();
        }
    });
}
