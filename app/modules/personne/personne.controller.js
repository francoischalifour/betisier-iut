'use strict';

var async = require('async');

var Personne = require('./personne.model');
var Departement = require('../departement/departement.model');
var Division = require('../division/division.model');
var Fonction = require('../fonction/fonction.model');
var Ville = require('../ville/ville.model');

var path = './personne/views/';

/**
 * Lists all people.
 *
 * @param {object} req
 * @param {object} res
 */
module.exports.List = function(req, res, next) {
    res.title = 'Liste des personnes';

    Personne.getAllPersonne(function(err, result) {
        if (err) {
            console.log(err);
            return next(err);
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
module.exports.View = function(req, res, next) {
    // If the user is not logged in.
    if (!req.session.userid || !req.session.username) {
        res.redirect('/login');
        return;
    }

    var per_num = req.params.id;

    Personne.getPersonneById(per_num, function(err, result) {
        if (err) {
            console.log(err);
            return next(err);
        }

        if (result.length === 0) {
            res.title = 'Utilisateur inconnu';
        } else {
            res.user = result[0];

            // Check if the user profile matches with the current user.
            if (parseInt(per_num) === req.session.userid || req.session.isAdmin) {
                res.canUpdate = true;
            }

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
module.exports.Create = function(req, res, next) {
    // If the user is not logged in.
    if (!req.session.userid || !req.session.username) {
        res.redirect('/login');
        return;
    }

    res.title = 'Ajouter une personne';

    if (req.method == 'POST') {
        var data = req.body;

        // Type of person (0 for étudiant, 1 for salarié).
        var typePers = data.per_type;

        // Remove inapropriate data.
        if (parseInt(typePers) === 0) {
            delete data.sal_telprof;
            delete data.fon_num;
        } else {
            delete data.dep_num;
            delete data.div_num;
        }

        // Remove the person type from the data object.
        delete data.per_type;

        Personne.loginHasAlreadyBeTaken(data.per_login, function(err, result) {
            if (err) {
                console.log(err);
                return next(err);
            }

            if (result[0].hasAlready === 0) {
                Personne.addPersonne(data, typePers, function(err, result) {
                    if (err) {
                        console.log(err);
                        return next(err);
                    }

                    res.render(path + 'createSuccess', res);
                });
            } else {
                res.render(path + 'createFailedLogin', res);
            }
        });
    } else {
        async.parallel([
            function(callback) {
                Departement.getAllDepartement(function(err, resultDep) {
                    if (err) {
                        console.log(err);
                        return next(err);
                    }

                    callback(null, resultDep);
                });
            },
            function(callback) {
                Division.getAllDivision(function(err, resultDiv) {
                    if (err) {
                        console.log(err);
                        return next(err);
                    }

                    callback(null, resultDiv);
                });
            },
            function(callback) {
                Fonction.getAllFonction(function(err, resultFon) {
                    if (err) {
                        console.log(err);
                        return next(err);
                    }

                    callback(null, resultFon);
                });
            }
        ], function(err, result) {
            if (err) {
                console.log(err);
                return next(err);
            }

            res.listeDepartement = result[0];
            res.listeDivision = result[1];
            res.listeFonction = result[2];

            res.render(path + 'create', res);
        });
    }
}

/**
 * Deletes a person.
 *
 * @param {object} req
 * @param {object} res
 */
module.exports.Delete = function(req, res, next) {
    // TODO : Rediriger vers la page deleteUnknown si la personne n'existe pas.
    // ISSUE : "Can't set headers after they are sent."
    // If the user is not logged in.
    if (!req.session.userid || !req.session.username) {
        res.redirect('/login');
        return;
    }

    // If the active user is not allowed.
    if (!req.session.isAdmin && parseInt(per_num) !== req.session.userid) {
        res.redirect('/people/all');
        return;
    }

    res.title = 'Supprimer un utilisateur';

    var per_num = req.params.id;

    Personne.deletePersonne(per_num, function(err, result) {
        if (err) {
            console.log(err);
            return next(err);
        }

        // If this is the active user, log him out.
        if (parseInt(per_num) === req.session.userid) {
            res.redirect('/logout');
            return;
        } else {
            res.render(path + 'delete', res);
        }
    });
}

/**
 * Edits a person.
 *
 * @param {object}   req
 * @param {object}   res
 * @param {function} next
 */
module.exports.Edit = function(req, res, next) {
    // ISSUE : Headers already sent.
    // TODO : sélectionner les valeurs par défaut dans les selects.
    // If the user is not logged in.
    if (!req.session.userid || !req.session.username) {
        res.redirect('/login');
        return;
    }

    // If the active user is not allowed.
    if (!req.session.isAdmin && parseInt(per_num) !== req.session.userid) {
        res.redirect('/people/all');
        return;
    }

    res.title = 'Editer un profil';

    var per_num = req.params.id;

    if (req.method == 'POST') {
        var data = req.body;

        console.log(data);

        Personne.editPersonne(data, per_num, function(err, result) {
            if (err) {
                console.log(err);
                return next(err);
            }

            res.render(path + 'editSuccess', res);
        });
    } else {
        async.parallel([
                function(callback) {
                    Personne.getPersonneById(per_num, function(err, resultPer) {
                        if (err) {
                            console.log(err);
                            return next(err);
                        }

                        callback(null, resultPer);
                    });
                },
                function(callback) {
                    Departement.getAllDepartement(function(err, resultDep) {
                        if (err) {
                            console.log(err);
                            return next(err);
                        }

                        callback(null, resultDep);
                    });
                },
                function(callback) {
                    Division.getAllDivision(function(err, resultDiv) {
                        if (err) {
                            console.log(err);
                            return next(err);
                        }

                        callback(null, resultDiv);
                    });
                },
                function(callback) {
                    Ville.getAllVille(function(err, resultVil) {
                        if (err) {
                            console.log(err);
                            return next(err);
                        }

                        callback(null, resultVil);
                    });
                },
                function(callback) {
                    Fonction.getAllFonction(function(err, resultFon) {
                        if (err) {
                            console.log(err);
                            return next(err);
                        }

                        callback(null, resultFon);
                    });
                }
            ],
            function(err, result) {
                if (err) {
                    console.log(err);
                    return next(err);
                }

                res.user = result[0][0];
                res.listeDepartement = result[1];
                res.listeDivision = result[2];
                res.listeVille = result[3];
                res.listeFonction = result[4];

                res.render(path + 'edit', res);
            });
    }
}
