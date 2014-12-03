var Lab = require('lab');
var lab = exports.lab = Lab.script();
var pg = require('pg');
var config = require('config');
var Promise = require('bluebird');
var pgp = Promise.promisifyAll(pg);
var Db = require('../lib/db');
var db = new Db(config.db.admin.url);
var template = require('../lib/template');
var statements = template.render('./aux/db/00-init.sql', config.db);

function query(text, vals) {
  var args = arguments;
  return pgp.connectAsync(config.db.admin.url)
    .spread(function(client, done) {
      return client.queryAsync.apply(client, args)
        .then(function(result) {
          done();
          return result;
        });
    });
}

lab.experiment('db hello world', function() {

  lab.test('db will executeSqlStatements', function(done) {
    db.executeSqlStatements(statements)
      .then(function(result) {
        console.log('executeSqlStatements result', result);
        done();
      })
      .catch(done);
  });

  lab.test('db will parseSqlStatements', function(done) {
    var a = db._parseSqlStatements(statements);
    console.log('statements array', a);
    done();
  });

  lab.test('db will create role', function(done) {
    db.testConnection()
      .then(function() {
        return db.query("  CREATE ROLE stock LOGIN ENCRYPTED PASSWORD 'md525377621dc5bb3b7c47fdd88056240d3' NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION  ")
          .then(function(result) {
            console.log('CREATE ROLE result', result);
            done();
          });
      })
      .catch(done);
  });

  lab.test('db will testConnection', function(done) {
    db.testConnection()
      .then(function(result) {
        console.log(result);
        done();
      })
      .catch(done);
  });

  lab.test('query will connect', function(done) {
    query('SELECT $1::int AS number', ['1'])
      .then(function(result) {
        console.log('easy', result);
        done();
      })
      .catch(done);
  });

  lab.test('promise will connect', function(done) {
    pgp.connectAsync(config.db.admin.url)
      .spread(function(client, clientDone) {
        client.queryAsync('SELECT $1::int AS number', ['1'])
          .then(function(qres) {
            console.log('query result', qres);
            clientDone();
            done();
          });
      })
      .catch(done);
  });

  lab.test('will connect', function(done) {
    pg.connect(config.db.admin.url, function(err, client, next) {
      if (err) {
        return console.error('error fetching client from pool', err);
      }
      client.query('SELECT $1::int AS number', ['1'], function(err, result) {
        //call `next()` to release the client back to the pool
        next();
        if (err) {
          return console.error('error running query', err);
        }
        console.log(result.rows[0].number);
        //output: 1
      });
    });
    done();
  });

});