'use strict';

var path = './login/views/';

/**
 * Shows impossible action page.
 *
 * @param {object} req
 * @param {object} res
 */
module.exports.ActionImpossible = function(req, res, next) {
    res.title = 'Action impossible';

    res.render(path + 'actionImpossble', res);
}
