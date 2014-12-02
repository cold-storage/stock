var pg = require('pg');
var Promise = require('bluebird');
var pgp = Promise.promisifyAll(pg);

// Just gives you a Db instance. Does not actually connect to the
// database. Use testConnection to make sure the connection is good.
//
// Takes the same arguments as pg.connect
// https://github.com/brianc/node-postgres/wiki/pg#method-connect
function Db(connectionStringOrConfig) {
	this.connectionStringOrConfig = connectionStringOrConfig;
}

// Takes the same arguments as client.query
// https://github.com/brianc/node-postgres/wiki/Client
//
// Always returns full result set. Doesn't support query.on('row')
// If you are going to have tons of results, we will need to come up
// with another way.
Db.prototype.query = function query() {
	var args = arguments;
	return pgp.connectAsync(this.connectionStringOrConfig)
		.spread(function(client, done) {
			var rv = null;
			if (Array.isArray(args[0])) {
				var proms = [];
				args[0].forEach(function(statement) {
					proms.push(client.queryAsync(statement));
				});
				rv = Promise.all(proms);
			} else {
				rv = client.queryAsync.apply(client, args);
			}
			return rv
				.then(function(result) {
					done();
					return result;
				})
				.catch(function(err) {
					done(err);
					throw err;
				});
		});
};

// As long as this method doesn't error, your connection is good.
// Takes no arguments.
Db.prototype.testConnection = function testConnection() {
	return this.query('SELECT $1::int AS number', ['1']);
};

Db.prototype.executeSqlStatements = function executeSqlStatements(sqlstatements) {
	var statements = this._parseSqlStatements(sqlstatements);
	// var proms = [];
	// var self = this;
	// statements.forEach(function(statement) {
	// 	proms.push(self.query(statement));
	// });
	// return Promise.all(proms);
	return this.query(statements);
};

Db.prototype._parseSqlStatements = function _parseSqlStatements(sqlstatements) {
	var a = sqlstatements.split('\n');
	var rv = [];
	var statement = '';
	a.forEach(function(line) {
		line = line.trim();
		if (line.indexOf('--') === 0) {
			// skip
		} else if (line === '') {
			// skip
		} else if (line.indexOf(';') === line.length - 1) {
			rv.push((statement + ' ' + line.substr(0, line.length - 1)).trim());
			statement = '';
		} else {
			statement += ' ' + line;
		}
	});
	return rv;
};

module.exports = Db;