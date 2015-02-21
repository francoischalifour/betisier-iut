'use strict';

var Citation = require('./citation.model');
var Personne = require('../personne/personne.model');
var Mot = require('../mot/mot.model');
var async = require('async');
var path = './citation/views/';

/**
 * Lists all citations.
 *
 * @param {object} req
 * @param {object} res
 */
module.exports.List = function(req, res) {
    res.title = 'Liste des citations';

    Citation.getAllCitation(function(err, result) {
        if (err) {
            console.log(err);
            return;
        }

        res.listeCitation = result;
        res.nbCitation = result.length;
        res.render(path + 'list', res);
    });
}

/**
 * Adds a new citation.
 *
 * @param {object} req
 * @param {object} res
 */
module.exports.Create = function(req, res) {
    // If the user is not logged in.
    if (!req.session.userid || !req.session.username) {
        res.redirect('/login');
        return;
    }

    res.title = 'Ajouter une citation';

    if (req.method == 'POST') {
        var forbidden = false;

        var data = req.body;
        data['per_num_etu'] = req.session.userid;

        Mot.getAllMot(function(err, resultMot) {
            var citation = data['cit_libelle'].toLowerCase();

            resultMot.forEach(function(mot) {
                if (citation.indexOf(mot.mot_interdit.toLowerCase()) !== -1) {
                    console.log('Mot interdit : ' + mot.mot_interdit);
                    forbidden = true;
                    return;
                }
            });

            if (!forbidden) {
                Citation.addCitation(data, function(err, result) {
                    if (err) {
                        console.log(err);
                        return;
                    }

                    res.dataCitation = result;
                    res.render(path + 'createSuccess', res);
                });
            }
        });
    } else {
        async.parallel([
            function(callback) {
                Personne.getAllPersonne(function(err, resultPer) {
                    callback(null, resultPer);
                });
            },
            function(callback) {
                Mot.getAllMot(function(err, resultMot) {
                    callback(null, resultMot);
                });
            }
        ], function(err, result) {
            res.listeSalarie = result[0];
            res.listeMot = result[1];
            res.render(path + 'create', res);
        });
    }
}

/**
 * Deletes a citation.
 *
 * @param {object} req
 * @param {object} res
 */
module.exports.Delete = function(req, res) {
    // If the user is not logged in.
    if (!req.session.userid || !req.session.username) {
        res.redirect('/login');
        return;
    }

    res.title = 'Supprimer une citation';

    var cit_num = req.params.id;

    Citation.deleteCitation(cit_num, function(err, result) {
        if (err) {
            console.log(err);
            return;
        }

        res.redirect('/citations/all');
    });
}

/**
 * Searches for a citation.
 *
 * @param {object} req
 * @param {object} res
 */
module.exports.Search = function(req, res) {
    // If the user is not logged in.
    if (!req.session.userid || !req.session.username) {
        res.redirect('/login');
        return;
    }

    if (req.method == 'POST') {
        var data = req.body;

        console.log(data);

        Citation.searchCitation(data, function(err, result) {
            if (err) {
                console.log(err);
                return;
            }

            res.title = 'Résultat de la recherche';
            res.listeResultat = result;
            res.nbResultat = result.length;
            res.render(path + 'searchResults', res);
        });
    } else {
        async.parallel([
            function(callback) {
                Personne.getAllPersonne(function(err, resultPer) {
                    callback(null, resultPer);
                });
            },
            function(callback) {
                Citation.getAllDate(function(err, resultDat) {
                    callback(null, resultDat);
                });
            },
            function(callback) {
                Citation.getAllMoyenne(function(err, resultMoy) {
                    callback(null, resultMoy);
                });
            }
        ], function(err, result) {
            res.title = 'Rechercher des citations';

            res.listePersonne = result[0];
            res.listeDate = result[1];
            res.listeNote = result[2];
            res.render(path + 'search', res);
        });
    }
}
