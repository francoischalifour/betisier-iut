'use strict';

var path = './admin/views/';

/**
 * Renders the index administration view.
 *
 * @param {object} req
 * @param {object} res
 */
module.exports.View = function(req, res) {
    res.title = 'Panneau d\'administration';
    res.render(path + 'show', res);
}
