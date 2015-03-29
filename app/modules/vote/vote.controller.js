'use strict';

var Vote = require('./vote.model');

var path = './vote/views/';

module.exports.Delete = function(req, res, next) {
    Vote.deleteVoteById(req.params.id, req.session.userid, function(err, result) {
        if (err) {
            console.log(err);
            return next(err);
        }

        res.title = 'Supprimer un vote';
        res.render(path + 'delete', res);
    });
}