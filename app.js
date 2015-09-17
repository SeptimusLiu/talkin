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

// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

rootDir = app.get('env') === 'development' ? 'app' : 'dist';
app.use(express.static(path.join(__dirname, rootDir)));

app.get('/', function (req, res){
  res.sendFile(path.join(__dirname, rootDir, ' index.html'));
});

module.exports = app;

/**
 * Get port from environment and store in Express.
 */
var port = _normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */
var server = app.listen(port);

var messages = [],
    users = [],
    userMap = {};

/**
 * Listen for socket connection
 */
var io = require('socket.io').listen(server);

io.on('connection', function (socket) {
  console.log('A user connected. ID is ' + socket.id);

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

  socket.on('users.add', function (user, fn) {
    console.log(user.name + ' has joined. user_id: ' + user.id);
    console.log(user.id in userMap);
    if (user.id && user.id in userMap) {
      // If user has joined ever, update and then return the user_id in map  
      users[userMap[user.id]] = user;
      console.log(JSON.stringify(userMap));
      fn(user);
    } else {
      // If user join first time, or user_id isn't in map yet, then generate a random number,
      // then add it to the map
      var randId = _pickId();
      var userNew = {
        name: user.name,
        id: randId
      };
      users.push(userNew);
      userMap[userNew.id] = users.length - 1;
      console.log('not: ' + JSON.stringify(userMap));
      fn(userNew);
    }
  });
});

server.listen(port);

/**
 * Normalize a port into a number, string, or false.
 */

function _normalizePort(val) {
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
 * Pick a random number to generate ID for user and channel.
 * @return {[number]}
 */
function _pickId() {
  var number = (new Date).getTime();
  for (var i = 0; i < 4; i++) {
    number += (Math.floor(Math.random()*10)).toString();
  }
  return parseInt(number);
}
