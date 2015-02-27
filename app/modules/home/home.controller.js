'use strict';

var Citation = require('../citation/citation.model');
var path = './home/views/';

/**
 * Renders the index view.
 *
 * @param {object} req
 * @param {object} res
 */
module.exports.View = function(req, res) {
    res.title = 'Accueil';

    Citation.getLastCitation(function(err, result) {
        if (err) {
            console.log(err);
            return;
        }

        res.citation = result;
        res.lastCitation = res.citation[0].cit_libelle;

        res.render(path + 'show', res);
    });
}
