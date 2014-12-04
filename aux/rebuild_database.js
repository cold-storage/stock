#!/usr/bin/env node

// Run from the project root so config will work.

var config = require('config');
var adminDb = new(require('../lib/db'))(config.db.admin.url);
var stockDb = new(require('../lib/db'))(config.db.stock.url);
var template = require('../lib/template');
var createRoleDbSql = template.render('./aux/db/0000-create-role-db.sql');



adminDb.executeSqlStatements(createRoleDbSql)
  .then(function() {
    return stockDb.executeSqlStatements('./aux/db/0001-ddl.sql');
  })
  .then(function() {
    console.log('success!');
  })
  .catch(function(err) {
    console.log('error!', err);
  })
  .finally(adminDb.end);