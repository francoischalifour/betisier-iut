'use strict';

var path = './home/views/';

/**
 * Renders the index view.
 *
 * @param {object} req
 * @param {object} res
 */
module.exports.View = function(req, res) {
    res.title = 'Accueil';
    res.render(path + 'show', res);
}
