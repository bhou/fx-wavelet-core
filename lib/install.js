var property = require('./property');
var os = require('os');
var fs = require('fs');
var exec = require('child_process').exec;
var path = require('path');
if (!path.isAbsolute) {
  path.isAbsolute = function (yourPath) {
    return path.resolve(yourPath) == path.normalize(yourPath)
  }
}

function installModule(name, version, done) {
  var repo = property.get('repo');

  var pluginDir = path.join(property.get('repo'), '/plugins');
  var waveletDir = path.join(property.get('repo'), '/wavelets');

  if (!fs.existsSync(repo)) {
    fs.mkdirSync(repo);
  }

  if (!fs.existsSync(pluginDir)) {
    fs.mkdirSync(pluginDir);
  }

  if (!fs.existsSync(pluginDir + '/node_modules')) {
    fs.mkdirSync(pluginDir + '/node_modules');
  }

  if (!fs.existsSync(waveletDir)) {
    fs.mkdirSync(waveletDir);
  }

  if (!fs.existsSync(waveletDir + '/node_modules')) {
    fs.mkdirSync(waveletDir + '/node_modules');
  }

  var cmd = 'npm install --prefix ';
  if (name.indexOf('fx-red') == 0 && name != 'fx-red') {
    cmd += waveletDir + ' ' + name;
    console.log('Installing wavelet [', name, ']...');
  } else {
    cmd += pluginDir + ' ' + name;
    console.log('Installing plugin [', name, ']...');
  }

  if (version) {
    cmd += '@' + version;
  }

  if (os.platform() == 'win32') {
    cmd += ' --msvs_version=2012';
  }

  console.log(cmd);
  exec(cmd, function (error, stdout, stderr) {
    console.log(stdout);

    if (error) {
      console.log('exec error: ' + error);
      return done(error);
    }

    // install node-red for fx-red
    // TODO: this is not good at all
    if (name == 'fx-red') {
      var delimiter = ";";
      var buildParam = '';
      if (os.platform() == 'win32') {
        delimiter = '&';
        buildParam = '--msvs_version=2012';
      }
      var newCmd = 'cd ' + pluginDir + '/node_modules/fx-red/node-red-customized ' + delimiter + ' npm install ' + buildParam;
      console.log(newCmd);
      exec(newCmd, function(err, stdo, stde) {
        console.log(stdo);

        if (err) {
          console.log('exec error: ' + err);
          return done(err);
        }

        done();
      });
    } else {
      done();
    }
  });
}

function installPack(modules, done) {
  var async = require('async');

  var tasks = [];

  for (var i = 0; i < modules.length; i++) {
    function getTask(module) {
      return function (cb) {
        installModule(module.name, module.version, cb);
      };
    }

    tasks.push(getTask(modules[i]));
  }

  async.series(tasks, function (err, results) {
    if (err) {
      console.error('Install failed!', err.message);
      return;
    }

    console.log('Install succeeds!')
  });
}

function installPackFromFile(file, done) {
  if (!fs.existsSync(file)) {
    return done(new Error('File not found! ' + file));
  }

  var desc = fs.readFileSync(file);

  try {
    desc = JSON.parse(desc);
  } catch (e) {
    return done(e);
  }

  installPack(desc, done);
}

function installPredefined(pack, done) {
  if (pack.indexOf('http') == 0) {
    // get json from http

  }

  // find pack definition json file in pack folder
  installPackFromFile(path.join(__dirname, '../pack/' + pack + '.json'), function(err) {
    if (err) {
      console.error('Fail install pack! Reason: ', err.message);
      return done(err);
    }

    done();
  });
}

function install(args) {
  var op = args[1];
  if (op == 'pack') {
    if (args.length < 3) {
      return cb(new Error('Please specify package name or path'));
    }

    var param = args[2];
    if (path.isAbsolute(param)) {
      installPackFromFile(param, cb);
    } else {
      if (param.indexOf('.') == 0) {
        installPackFromFile(path.join(process.cwd(), param), cb);
      } else {
        // get predefined module
        installPredefined(param, cb);
      }
    }
  } else {
    var name = null;
    var version = null;
    if (args.length < 2) {
      return cb(new Error('Please specify plugin name'))
    }

    if (args.length < 3) {
      name = args[1];
    }

    if (args.length >= 3) {
      version = args[2];
    }


    installModule(name, version, cb);
  }
}

function cb(err) {
  if (err) {
    console.error(err.message);
    return;
  }

  console.info('Done!');
};


module.exports = install;