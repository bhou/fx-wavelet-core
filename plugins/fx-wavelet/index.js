module.exports = function (options, imports, register) {
  var logger = imports.logger.getLogger('Wavelet');

  var express = imports.express;
  var webapp = imports.webapp;
  var server = imports.server;
  var middlewares = imports.middlewares;
  var RED = imports.red;


  var argv = options.argv;

  /* apply all middlewares */
  for (var key in middlewares) {
    if (middlewares.hasOwnProperty(key) && typeof middlewares[key] === 'function') {
      webapp.use(middlewares[key]);
    }
  }

  var port = argv.port || 8080;
  server.listen(port, function (err) {
    if (!argv.disableEditor) {
      RED.start();
    }

    logger.info('Wavelet app is running at port ' + port);
  });

  register(null, {
    "waveletApp": webapp
  });
};