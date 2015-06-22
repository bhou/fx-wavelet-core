module.exports = function(help) {
  if (!help) {
    help = [];
  }
  console.log('Usage: wavelet [action] [options]');
  console.log('Action:');
  console.log('');
  console.log('start [app] [options]   start an application');
  console.log(' App: application path, by default: current working directory');
  console.log(' Options:');
  console.log('   --config: the wavelet configuration file, by default {your app}/app.js');
  console.log('   --root: the web app root');
  console.log('   --port: the web app port');
  console.log('   --disableEditor: disable the application editor');
  console.log(' Plugin Options:');
  console.log('');
  console.log('create [project]     create a wavelet project');
  console.log('');
  console.log('install [plugin/wavelet] [version]    install plugin or wavelet');
  console.log('');
  console.log('install pack [plugin/wavelet pack]    install plugin or wavelet package');
  console.log(' plugin/wavelet pack could be a name or a pack file path');
  console.log('   Example: wavelet install pack core');
  console.log('   Example: wavelet install pack .pack.json');
  console.log('');
  console.log('get repo   get repository location');
  console.log('');
  console.log('set repo [location]  set repository location');
  console.log('');

  for (var i = 0; i < help.length; i++) {
    console.log('   ' + help[i]);
  }

  console.log('');
};