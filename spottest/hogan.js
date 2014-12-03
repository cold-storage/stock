var Lab = require('lab');
var lab = exports.lab = Lab.script();
var Hogan = require('hogan.js');
var config = require('config');
var fs = require('fs');
var sql = fs.readFileSync('./aux/db/00-init.sql', 'utf-8');
var template = require('../lib/template');

lab.experiment('hogan tests', function() {

	lab.test('will template', function(done) {

		var output = template.render('./aux/db/00-init.sql', config.db);
		console.log('path param', output);

		output = template.render(sql, config.db);
		console.log('string param', output);

		done();

	});

	lab.test('will do simple template', function(done) {

		var tmp = Hogan.compile(sql);
		var output = tmp.render(config.db);
		console.log('Hogan hero!', output);
		done();

	});

});