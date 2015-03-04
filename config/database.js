'use strict';

/**
 * Imports MySQL.
 *
 * @type {object}
 * @private
 */
var mysql = require('mysql');

/**
 * Pools connections to ease sharing a single connection, or managing multiple connections.
 *
 * @type {[type]}
 */
var pool = mysql.createPool({
    host: 'localhost',
    user: 'bd',
    password: 'bede',
    database: 'betisier',
    port: '3306'
});

/**
 * Gets connection from the database.
 *
 * @param  {function} callback
 * @export
 */
module.exports.getConnection = function(callback) {
    pool.getConnection(function(err, connection) {
        callback(err, connection);
    });
}
