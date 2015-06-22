
var start = require('./start');
var create = require('./create');
var help = require('./help');
var property = require('./property');
var install = require('./install');

module.exports = function () {
  var argv = require('minimist')(process.argv.slice(2));

  if (argv._.length > 0) {
    if (argv._[0] == 'start') {
      if (argv._.length < 2) {
        argv._.push(process.cwd());
      }
      start(argv._[1], argv.config, argv.root);
      return;
    }

    if (argv._[0] == 'create') {
      if (argv._.length < 2) {
        console.error('Please specify the project name');
        return;
      }

      create(argv._[1]);
      return;
    }

    if (argv._[0] == 'set') {
      if (argv._.length < 3) {
        console.error('Please specify the property and its value');
        return;
      }

      property.set(argv._[1], argv._[2]);

      var value = property.get(argv._[1]);
      console.log('Property', argv._[1], '=', value);
      return;
    }

    if (argv._[0] == 'get') {
      if (argv._.length < 2) {
        console.error('Please specify the property name');
        return;
      }

      var value = property.get(argv._[1]);
      console.log('Property', argv._[1], '=', value);
      return;
    }

    if (argv._[0] == 'reset') {
      if (argv._.length < 2) {
        console.error('Please specify the property name');
        return;
      }

      var value = property.reset(argv._[1]);
      console.log('Property', argv._[1], '=', value);
      return;
    }

    if (argv._[0] == 'install') {
      if (argv._.length < 2) {
        console.error('Please specify the module or package');
        return;
      }

      install(argv._);
      return;
    }

    help();
  }

  help();
};