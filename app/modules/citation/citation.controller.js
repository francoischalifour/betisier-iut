'use strict';

var Citation = require('./citation.model');
var Personne = require('../personne/personne.model');
var Mot = require('../mot/mot.model');
var Vote = require('../vote/vote.model');
var async = require('async');
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
        },
        // Has the user already voted?
        /*function(callback) {
            var cit_num = resultCit.cit_num;
            var per_num = req.session.userid;
            Citation.hasAlreadyVoted(cit_num, per_num, function(err, resultCitVot) {
                if (err) {
                    console.log(err);
                    return next(err);
                }

                callback(null, resultCitVot);
            });
        }*/
    ], function(err, result) {
        if (err) {
            console.log(err);
            return next(err);
        }

        res.listeCitation = result[0];
        res.nbCitation = result[0].length;
        res.listeCitationEnAttente = result[1];
        res.nbCitationEnAttente = result[1].length;

        // Change numeric to string so Handlebars doesn't ignore the 0 value.
        res.listeCitation.forEach(function(vote) {
            if (vote.vot_valeur === 0) {
                vote.vot_valeur = vote.vot_valeur.toString();
            }
        });

        /*if (result[2].hasAlready === 0) {
            res.canVote = true;
        }*/

        res.render(path + 'list', res);
    });
}

/**
 * Adds a new citation.
 *
 * @param {object} req
 * @param {object} res
 */
module.exports.Create = function(req, res, next) {
    // If the user is not logged in.
    if (!req.session.userid || !req.session.username) {
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
            // Get all persons to show in the list.
            function(callback) {
                Personne.getAllPersonne(function(err, resultPer) {
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
    // If the user is not logged in.
    if (!req.session.userid || !req.session.username) {
        res.redirect('/login');
        return;
    }

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
    // If the user is not logged in.
    if (!req.session.userid || !req.session.username) {
        res.redirect('/login');
        return;
    }

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

        console.log(data);

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
                Personne.getAllPersonne(function(err, resultPer) {
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
    // TODO : empêcher de voter une deuxième fois.
    // If the user is not logged in.
    if (!req.session.userid || !req.session.username) {
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
