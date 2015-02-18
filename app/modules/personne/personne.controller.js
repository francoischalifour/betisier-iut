'use strict';

var Personne = require('./personne.model');
var Departement = require('../departement/departement.model');
var Division = require('../division/division.model');
var Fonction = require('../fonction/fonction.model');
var async = require('async');
var path = './personne/views/';

/**
 * Lists all people.
 *
 * @param {object} req
 * @param {object} res
 */
module.exports.List = function(req, res) {
    res.title = 'Liste des personnes';

    Personne.getAllPersonne(function(err, result) {
        if (err) {
            console.log(err);
            return;
        }

        res.listePersonne = result;
        res.nbPersonne = result.length;
        res.render(path + 'list', res);
    });
}

/**
 * Views a user profile.
 *
 * @param {object} req
 * @param {object} res
 */
module.exports.View = function(req, res) {
    var per_num = req.params.id;

    Personne.getPersonneById(per_num, function(err, result) {
        if (err) {
            console.log(err);
            return;
        }

        if (result.length === 0) {
            res.title = 'Utilisateur inconnu';
        } else {
            res.user = result[0];
            res.title = res.user.per_prenom + ' ' + res.user.per_nom;
        }

        res.render(path + 'show', res);
    });
}


/**
 * Adds a new person.
 *
 * @param {object} req
 * @param {object} res
 */
module.exports.Create = function(req, res) {
    res.title = 'Ajouter une personne';

    if (req.method == 'POST') {
        var data = req.body;

        console.log(data);

        var typePers = 0;

        Personne.addPersonne(data, typePers, function(err, result) {
            if (err) {
                console.log(err);
                return;
            }

            res.dataPersonne = result;
            res.render(path + 'list', res);
        });
    } else {
        async.parallel([
            function(callback) {
                Departement.getAllDepartement(function(err, resultDep) {
                    callback(null, resultDep);
                });
            },
            function(callback) {
                Division.getAllDivision(function(err, resultDiv) {
                    callback(null, resultDiv);
                });
            },
            function(callback) {
                Fonction.getAllFonction(function(err, resultFon) {
                    callback(null, resultFon);
                });
            }
        ], function(err, result) {
            res.listeDepartement = result[0];
            res.listeDivision = result[1];
            res.listeFonction = result[2];
            res.render(path + 'create', res);
        });
    }
}
