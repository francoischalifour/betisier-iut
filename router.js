'use strict';

/**
 * Declares route names.
 *
 * @param  {object} app
 */
module.exports = function(app) {
    app.use('/api/', require('./app/modules/api/'));
    app.use('/citations/', require('./app/modules/citation/'));
    app.use('/villes/', require('./app/modules/ville/'));
    app.use('/people/', require('./app/modules/personne/'));
    app.use('/', require('./app/modules/login/'));
    app.use('*', require('./app/modules/home/'));
}
