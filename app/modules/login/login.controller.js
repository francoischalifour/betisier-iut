'use strict';

var Personne = require('../personne/personne.model');
var path = './login/views/';

/**
 * Logs a user in.
 *
 * @param {object} req
 * @param {object} res
 */
module.exports.Login = function(req, res, next) {
    // If the user is already logged in.
    if (req.session.userid && req.session.username) {
        res.redirect('/');
        return;
    }

    res.title = 'Connexion';

    if (req.method === 'POST') {
        var data = req.body;

        Personne.checkLogin(data, function(err, result) {
            if (err) {
                console.log(err);
                return next(err);
            }

            if (result.length === 1) {
                // Set session information.
                req.session.userid = result[0].per_num;
                req.session.username = data.login;
                req.session.isAdmin = result[0].per_admin;

                res.session = req.session;

                // Set cookies information.
                /*res.cookie('login_token', +new Date(), {
                    maxAge: 3600000,
                    path: '/'
                });*/
            } else {
                res.error = true;
            }

            res.render(path + 'login', res);
        });
    } else {
        res.render(path + 'login', res);
    }
}

/**
 * Logs a user out.
 *
 * @param {object} req
 * @param {object} res
 */
module.exports.Logout = function(req, res, next) {
    // If the user is not logged in.
    if (!req.session.userid || !req.session.username) {
        res.redirect('/login');
        return;
    }

    res.title = 'Déconnexion';

    // Destroy sessions.
    req.session.login = '';
    req.session.destroy();

    // Destroy cookies
    //res.clearCookie('login_token');

    res.redirect('/');
}
