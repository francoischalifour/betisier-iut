'use strict';

var async = require('async');
var q = require('q');

var Citation = require('./citation.model');
var Personne = require('../personne/personne.model');
var Salarie = require('../personne/salarie/salarie.model');
var Mot = require('../mot/mot.model');
var Vote = require('../vote/vote.model');

var LoginController = require('../login/login.controller');

var path = './citation/views/';

/**
 * Lists all citations.
 *
 * @param {object} req
 * @param {object} res
 */
module.exports.List = function(req, res, next) {
    res.title = 'Liste des citations';

    async.parallel([
        // Get all citations.
        function(callback) {
            Citation.getAllCitation(function(err, resultCit) {
                if (err) {
                    console.log(err);
                    return next(err);
                }

                callback(null, resultCit);
            });
        },
        // Get all citations to be validated for the admin.
        function(callback) {
            Citation.getAllCitationEnAttente(function(err, resultCitEnAtt) {
                if (err) {
                    console.log(err);
                    return next(err);
                }

                callback(null, resultCitEnAtt);
            });
        }
    ], function(err, result) {
        if (err) {
            console.log(err);
            return next(err);
        }

        res.listeCitation = result[0];
        res.nbCitation = result[0].length;
        res.listeCitationEnAttente = result[1];
        res.nbCitationEnAttente = result[1].length;

        var promises = [];

        res.listeCitation.forEach(function(citation) {
            // Create the object.
            var deferred = q.defer();
            promises.push(deferred.promise);

            // Change numeric to string so Handlebars doesn't ignore the 0 value.
            if (citation.vot_valeur === 0) {
                citation.vot_valeur = citation.vot_valeur.toString();
            }

            // Has the user already voted this citation?
            Citation.hasAlreadyVoted(citation.cit_num, req.session.userid, function(err, resultCitVot) {
                if (err) {
                    console.log(err);
                    deferred.reject(err);
                    return next(err);
                }

                citation.hasAlready = resultCitVot[0].hasAlready;
                deferred.resolve();
            });
        });

        // If the user is a student or an admin, he can vote.
        if (req.session.userid && !req.session.isSalarie || req.session.isAdmin && !req.session.isSalarie) {
            res.canVote = true;
        }

        q.all(promises)
            .then(function() {
                res.render(path + 'list', res);
            })
            .catch(function(error) {
                return next(error);
            });
    });
}

/**
 * Shows a citation.
 *
 * @param {object}   req
 * @param {object}   res
 * @param {objet} next
 */
module.exports.View = function(req, res, next) {
    var cit_num = req.params.id;

    Citation.getCitationById(cit_num, function(err, result) {
        if (err) {
            console.log(err);
            return next(err);
        }

        res.title = 'Voir une citation';
        res.citation = result[0];

        Vote.getVoteByCitationId(cit_num, function(err, result) {
            if (err) {
                console.log(err);
                return next(err);
            }

            res.notes = result;
            res.nbNotes = result.length;

            res.render(path + 'show', res);
        });
    });
}

/**
 * Adds a new citation.
 *
 * @param {object} req
 * @param {object} res
 */
module.exports.Create = function(req, res, next) {
    // If the user is not logged in or is an employee.
    if (!req.session.userid || !req.session.username || req.session.isSalarie) {
        res.redirect('/login');
        return;
    }

    res.title = 'Ajouter une citation';

    // Add the citation in the database.
    if (req.method === 'POST') {
        var forbidden = false;

        var data = req.body;
        data.per_num_etu = req.session.userid;

        Mot.getAllMot(function(err, resultMot) {
            if (err) {
                console.log(err);
                return next(err);
            }

            var citation = data.cit_libelle.toLowerCase();

            // Check if there is a forbidden word in the citation.
            resultMot.forEach(function(mot) {
                if (citation.indexOf(mot.mot_interdit.toLowerCase()) !== -1) {
                    forbidden = true;
                    return;
                }
            });

            if (!forbidden) {
                Citation.addCitation(data, function(err, result) {
                    if (err) {
                        console.log(err);
                        return next(err);
                    }

                    res.dataCitation = result;
                    res.render(path + 'createSuccess', res);
                });
            } else {
                res.render(path + 'create', res);
            }
        });
    } else {
        // Show the creation page.
        async.parallel([
            // Get all Salariés to show in the list.
            function(callback) {
                Salarie.getAllSalarie(function(err, resultPer) {
                    if (err) {
                        console.log(err);
                        return next(err);
                    }

                    callback(null, resultPer);
                });
            },
            // Get all forbidden words.
            function(callback) {
                Mot.getAllMot(function(err, resultMot) {
                    if (err) {
                        console.log(err);
                        return next(err);
                    }

                    callback(null, resultMot);
                });
            }
        ], function(err, result) {
            if (err) {
                console.log(err);
                return next(err);
            }

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
module.exports.Delete = function(req, res, next) {
    // If the user is not allowed.
    if (!req.session.isAdmin) {
        res.redirect('/citations/all');
        return;
    }

    res.title = 'Supprimer une citation';

    var cit_num = req.params.id;

    Citation.deleteCitation(cit_num, function(err, result) {
        if (err) {
            console.log(err);
            return next(err);
        }
    });

    res.render(path + 'deleteSuccess', res);
}

/**
 * Validates a citation.
 *
 * @param {object} req
 * @param {object} res
 */
module.exports.Validate = function(req, res, next) {
    // If the user is not allowed.
    if (!req.session.isAdmin) {
        res.redirect('/citations/all');
        return;
    }

    res.title = 'Valider une citation';

    var cit_num = req.params.id;
    var per_num = req.session.userid;

    Citation.validateCitation(per_num, cit_num, function(err, result) {
        if (err) {
            console.log(err);
            return next(err);
        }
    });

    res.render(path + 'validateSuccess', res);
}

/**
 * Searches for a citation.
 *
 * @param {object} req
 * @param {object} res
 */

module.exports.Search = function(req, res, next) {
    // If the user is not logged in.
    if (!req.session.userid || !req.session.username) {
        res.redirect('/login');
        return;
    }

    if (req.method == 'POST') {
        var data = req.body;

        Citation.searchCitation(data, function(err, result) {
            if (err) {
                console.log(err);
                return next(err);
            }

            res.title = 'Résultat de la recherche';
            res.listeResultat = result;
            res.nbResultat = result.length;
            res.render(path + 'searchResults', res);
        });
    } else {
        async.parallel([

            function(callback) {
                Salarie.getAllSalarie(function(err, resultPer) {
                    if (err) {
                        console.log(err);
                        return next(err);
                    }

                    callback(null, resultPer);
                });
            },
            function(callback) {
                Citation.getAllDate(function(err, resultDat) {
                    if (err) {
                        console.log(err);
                        return next(err);
                    }

                    callback(null, resultDat);
                });
            },
            function(callback) {
                Citation.getAllMoyenne(function(err, resultMoy) {
                    if (err) {
                        console.log(err);
                        return next(err);
                    }

                    callback(null, resultMoy);
                });
            }
        ], function(err, result) {
            if (err) {
                console.log(err);
                return next(err);
            }

            res.title = 'Rechercher des citations';

            res.listePersonne = result[0];
            res.listeDate = result[1];
            res.listeNote = result[2];
            res.render(path + 'search', res);
        });
    }
}

/**
 * Notes a citation.
 * @param {object} req
 * @param {object} res
 */
module.exports.Vote = function(req, res, next) {
    // If the user is not logged in or is an employee.
    if (!req.session.userid || !req.session.username || req.session.isSalarie && !req.session.isAdmin) {
        res.redirect('/login');
        return;
    }

    res.title = 'Noter une citation';

    if (req.method === 'POST') {
        var data = req.body;
        data.cit_num = req.params.id;
        data.per_num = req.session.userid;

        // Check if the number is between 0 and 20.
        data.vot_valeur = (data.vot_valeur < 0) ? 0 : data.vot_valeur;
        data.vot_valeur = (data.vot_valeur > 20) ? 20 : data.vot_valeur;

        Citation.noteCitation(data, function(err, result) {
            if (err) {
                console.log(err);
                return next(err);
            }

            res.dataVote = result;
            res.render(path + 'vote', res);
        });
    } else {
        var cit_num = req.params.id;

        Citation.getCitationById(cit_num, function(err, result) {
            if (err) {
                console.log(err);
                return next(err);
            }

            var notes = [];

            for (var i = 0; i <= 20; i++) {
                notes.push(i);
            }

            Citation.hasAlreadyVoted(cit_num, req.session.userid, function(err, resultVoted) {
                if (err) {
                    console.log(err);
                    return next(err);
                }

                if (resultVoted[0].hasAlready === 0) {
                    res.citation = result[0];
                    res.listeNote = notes;
                    res.canVote = true;

                    res.render(path + 'vote', res);
                } else {
                    res.render(path + 'voteImpossible', res);
                }
            });
        });
    }
}

/**
 * Returns all notes from a citation.
 *
 * @param {object}   req
 * @param {object}   res
 * @param {objet} next
 */
module.exports.Get = function(req, res, next) {
    var cit_num = req.params.id;

    Vote.getVoteByCitationId(cit_num, function(err, result) {
        if (err) {
            console.log(err);
            return next(err);
        }

        res.json(result);
    });
}

/**
 * Returns all forbidden words.
 *
 * @param {object}   req
 * @param {object}   res
 * @param {objet} next
 */
module.exports.ForbiddenWords = function(req, res, next) {
    Mot.getAllMot(function(err, result) {
        if (err) {
            console.log(err);
            return next(err);
        }

        res.json(result);
    });
}
