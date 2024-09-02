const path = require('path');
const fs = require('fs');



createProjectStructure();

function createProjectStructure() {
  let folders = ['config', 'modules'];
  loopCreateFolders(0, folders);
}

function loopCreateFolders(index, folders) {
  if (!folders[index]) {
    initServer();
  } else {
    folder = folders[index];
    if (!fs.existsSync('./node_modules/' + folder + '/')) {
      console.log("Link to modules Need to be created ");
      fs.symlink('../' + folder + '/', './node_modules/' + folder, function (err, res) {
        if (err) {
          console.error("Link to " + folder + " Error on creation");
          console.error(err);
        } else {
          console.log("Link to " + folder + " Created");
        }
        loopCreateFolders(index + 1, folders);
      });
    } else {
      console.log("Link to " + folder + " Check");
      loopCreateFolders(index + 1, folders);
    }
  }
}



function initServer() {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

  var createError = require('http-errors');
  var express = require('express');
  var cookieParser = require('cookie-parser');

  var logger = require('morgan');
  var debug = require('debug')('influmer-app:server');

  const klawSync = require('klaw-sync')

  global.config = {};
  global.config.debug = require('config/debug.json');
  var config_app = require('config/app.json');


  var http = require('http');
  var port = normalizePort(process.env.PORT || config_app.port);

  var exphbs = require('express-handlebars');
  var helpers = require('handlebars-helpers')();

  var i18n = require('i18n');
  i18n.configure({
    locales: ['es', 'en'],
    defaultLocale: 'es',
    cookie: 'lang',
    queryParameter: 'lang',
    objectNotation: true,
    directory: path.join(__dirname, "/i18n")
  });


  var app = express();

  // view engine setup
  app.set('port', port);
  console.log(`[app] Running on port: ${port}`);

  app.set('views', path.join(__dirname, '/views/pages'));

  helpers.__catalog = function () {
    return JSON.stringify(i18n.getCatalog(i18n.getLocale()));
  }
  helpers.__ = function () {
    return i18n.__.apply(this, arguments);
  };
  helpers.__n = function () {
    return i18n.__n.apply(this, arguments);
  };


  app.engine('hbs', exphbs({
    extname: 'hbs',
    defaultView: 'default',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/components',
    helpers: helpers
  }));

  app.set('view engine', 'hbs');

  app.use(function (req, res, next) {
    var origin = '*';
    if (req.get('origin')) {
      origin = req.get('origin');
    }
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  var routes = {};
  var count_routes = 0;
  route_files = klawSync(path.join(__dirname, 'routes'), { nodir: true });
  route_files.forEach(function (route_file) {
    let route_name = 'route-' + route_file.path.replace(__dirname + "/routes/", "").replace(".js", "").replace("/", "-");
    let route_path = '.' + route_file.path.replace(__dirname, "");
    let app_path = route_file.path.replace(__dirname + "/routes", "").replace("route.js", "");
    routes[route_name] = require(route_path);
    app.use("/", routes[route_name]);
    count_routes++;
  });
  console.log(`[routes] Routes loaded (${count_routes} routes)`);

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    console.error(err);
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('errors/' + (err.status || 500) + '/page', {
      layout: 'errors/layout',
      data: {}
    });

  });

  var server = http.createServer(app);

  /**
   * Listen on provided port, on all network interfaces.
   */

  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);

  /**
   * Normalize a port into a number, string, or false.
   */

  function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
      // named pipe
      return val;
    }

    if (port >= 0) {
      // port number
      return port;
    }

    return false;
  }

  /**
   * Event listener for HTTP server "error" event.
   */

  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  /**
   * Event listener for HTTP server "listening" event.
   */

  function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }


}
