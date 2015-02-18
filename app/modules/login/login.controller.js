'use strict';

var Personne = require('../personne/personne.model');
var path = './login/views/';

/**
 * Logs in a user.
 *
 * @param {object} req
 * @param {object} res
 */
module.exports.Login = function(req, res) {
    res.title = 'Connexion';

    if (req.session.userid && req.session.username) {
        res.redirect('/');
        return;
    }

    if (req.method == 'POST') {
        var data = req.body;

        Personne.checkLogin(data, function(err, result) {
            if (err) {
                console.log(err);
                return;
            }

            if (result.length === 1) {
                req.session.userid = result[0].per_num;
                req.session.username = data.login;
            }
        });
    }

    res.session = req.session;

    res.render(path + 'login', res);
}

/**
 * Logs out a user.
 *
 * @param {object} req
 * @param {object} res
 */
module.exports.Logout = function(req, res) {
    res.title = 'Déconnexion';

    req.session.login = '';

    req.session.destroy();

    res.redirect('/');
}
