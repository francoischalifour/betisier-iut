'use strict';

var Vote = require('./vote.model');

var path = './vote/views/';

/**
 * Deletes a vote.
 * @param {object}   req
 * @param {object}   res
 * @param {function} next
 */
module.exports.Delete = function(req, res, next) {
    // If the user is not logged in.
    if (!req.session.userid || !req.session.username) {
        res.redirect('/login');
        return;
    }

    Vote.deleteVoteById(req.params.id, req.session.userid, function(err, result) {
        if (err) {
            console.log(err);
            return next(err);
        }

        res.title = 'Supprimer un vote';
        res.render(path + 'delete', res);
    });
}
