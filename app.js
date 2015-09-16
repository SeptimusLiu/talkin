var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var debug = require('debug')('talkin:server');
var http = require('http');

// var routes = require('./server/routes/index');
// var users = require('./server/routes/users');

var app = express();
var rootDir = '';

// connect to mongodb
// mongoose.connect('mongodb://localhost/talkin', function (err) {
//     if(err) {
//         console.log('connection error', err);
//     } else {
//         console.log('connection successful');
//     }
// });

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
app.set('env', 'development');
// app.engine('html', require('ejs').renderFile);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/users', users);

// error handlers

// development error handler
// will print stacktrace
rootDir = app.get('env') === 'development' ? 'app' : 'dist';
// app.set('views', __dirname + '/app'); 
app.use(express.static(path.join(__dirname, rootDir)));

app.get('/', function (req, res){
  res.sendFile(path.join(__dirname, rootDir, ' index.html'));
});

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.sendFile(path.join(__dirname, rootDir, '404.html'), {
//     message: err.message,
//     error: {}
//   });
// });

module.exports = app;

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = app.listen(port);

/**
 * Listen on provided port, on all network interfaces.
 */
var messages = [],
    users = [];

var io = require('socket.io').listen(server);

io.on('connection', function (socket) {
  console.log('A user connected.');

  socket.on('messages.read', function () {
    console.log('message reading');
    socket.emit('messages.read', messages);
  });

  socket.on('messages.create', function (message) {
    console.log('message created');
    messages.push(message);
    io.sockets.emit('messages.add', message);
  });

  socket.on('disconnect', function () {
    console.log('A user disconnected.');
  });
  
  socket.on('channel.join', function (channel) {
    socket.join(channel); 
  });
});

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Listen for socket connection
 */


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
