'use strict';

var Ville = require('./ville.model');
var path = './ville/views/';

/**
 * Renders the all cities view.
 *
 * @param {object} req
 * @param {object} res
 */
module.exports.List = function(req, res) {
    res.title = 'Liste des villes';

    Ville.getAllVille(function(err, result) {
        if (err) {
            console.log(err);
            return;
        }

        res.listeVille = result;
        res.nbVille = result.length;
        res.render(path + 'list', res);
    });
}

/**
 * Renders the city add view.
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

    res.title = 'Ajouter une ville';

    if (req.method == 'POST') {
        var vil_nom = req.body.vil_nom;

        Ville.addVille(vil_nom, function(err, result) {
            if (err) {
                console.log(err);
                return;
            }

            res.redirect('/villes/all');
        });
    } else {
        res.render(path + 'create', res);
    }
}

/**
 * Renders the city update view.
 *
 * @param {object} req
 * @param {object} res
 */
module.exports.Edit = function(req, res) {
    // If the user is not logged in.
    if (!req.session.userid || !req.session.username) {
        res.redirect('/login');
        return;
    }

    // If the user is not allowed.
    if (!req.session.isAdmin) {
        res.redirect('/villes/all');
        return;
    }

    res.title = 'Modifier une ville';
    var vil_num = req.params.id;

    if (req.method == 'POST') {
        var vil_nom = req.body.vil_nom;

        Ville.editVille(vil_num, vil_nom, function(err, result) {
            if (err) {
                console.log(err);
                return;
            }

            res.redirect('/villes/all');
        });
    } else {
        Ville.getVilleById(vil_num, function(err, result) {
            if (err) {
                console.log(err);
                return;
            }

            res.ville = result[0];
            res.render(path + 'edit', res);
        });
    }
}

/**
 * Renders the city delete view.
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

    // If the user is not allowed.
    if (!req.session.isAdmin) {
        res.redirect('/villes/all');
        return;
    }

    res.title = 'Supprimer une ville';

    var vil_num = req.params.id;

    Ville.deleteVille(vil_num, function(err, result) {
        if (err) {
            console.log(err);
            return;
        }

        res.redirect('/villes/all');
    });
}
