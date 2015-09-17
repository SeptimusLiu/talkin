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

/**
 * messages(Array) structure:
 * @channel_id : {
 *  @id {Number}
 *  @user_id {Number}
 *  @user_name {String}
 *  @content {String}
 *  @time {Date}
 * }
 */
var messages = {};

/**
 * channels(Object) structure:
 * @id {Number}
 * @name {String}
 */
var squareId = _pickId();
var channels = {};
channels[squareId] = 'Square'; // Default channel

/**
 * users(Array) structures:
 * @id {Number}
 * @name {String}
 * @last_login_time {Date}
 */

// TODO: Free users after long time not login
var users = [],
    userMap = {};


/**
 * Listen for socket connection
 */
var io = require('socket.io').listen(server);

io.on('connection', function (socket) {
  console.log('A user connected. ID is ' + socket.id);

  socket.on('disconnect', function () {
    console.log('A user disconnected.');
  });

  /**
   * Message events
   */
  socket.on('message:get', function (channelId, fn) {
    console.log('message reading');
    var messageList = {
      messages: messages[channelId],
      channel_id: channelId
    };
    fn(messageList);
  });

  socket.on('message:send', function (packet) {
    console.log('message sent');
    if (packet && packet.channel_id in channels) {
      console.log(packet.channel_id);
      var message = {
        id: _pickId(),
        user_id: packet.user_id,
        user_name: packet.user_name,
        content: packet.content,
        time: new Date()
      };
      if (!messages[packet.channel_id])
        messages[packet.channel_id] = [];
      messages[packet.channel_id].push(message);
      var messageItem = {
        message: message,
        channel_id: packet.channel_id
      }
      io.sockets.to(packet.channel_id).emit('message:recv', messageItem);
    }
  });

  socket.on('message:remove', function (packet) {
    if (packet && packet.message_id && packet.channel_id in channels) {
      console.log('deleteing');
      var index = -1;
      messages[packet.channel_id].forEach(function (message, i) {
        if (message.id === packet.message_id) {
          index = i;
        }
      });
      if (index !== -1)
        messages[packet.channel_id].splice(index, 1);
      var messageList = {
        messages: messages[packet.channel_id],
        channel_id: packet.channel_id
      };
      io.sockets.to(packet.channel_id).emit('message:get', messageList);
    }
  });
  
  /**
   * Channel events
   */
  socket.on('channel:get', function (channel, fn) {
    console.log('channel getting');
    // socket.emit('channel:get', channels); 
    fn(channels);
  });


  socket.on('channel:join', function (channel, fn) {
    console.log('A user joined channel ' + channel.id);
    var channelItem = {};
    if (channel.id && channel.id in channels) {
      // If a valid channel id provided, then join it.
      console.log(JSON.stringify(channels));
      channel.name = channels[channel.id];
      channelItem = channel;
    } else {
      // Otherwise generate a new channel.
      var randId = _pickId();
      channelItem = {
        name: channel.name,
        id: randId
      };
      console.log('not:' + JSON.stringify(channels));
      channels[channelItem.id] = channelItem.name;
    }
    socket.join(channelItem.id);
    fn(channelItem);
  });

  /**
   * User events
   */
  socket.on('user:add', function (user, fn) {
    console.log(user.name + ' has joined. user_id: ' + user.id);
    var userItem = {};
    if (user.id && user.id in userMap) {
      // If user has joined ever, update and then return the user_id in map  
      users[userMap[user.id]] = user;
      console.log(JSON.stringify(userMap));
      userItem = user;
    } else {
      // If user join first time, or user_id isn't in map yet, then generate a random number,
      // then add it to the map
      var randId = _pickId();
      userItem = {
        name: user.name,
        id: randId
      };
      users.push(userItem);
      userMap[userItem.id] = users.length - 1;
      console.log('not: ' + JSON.stringify(userMap));
      // Let the user join the default channel
      // socket.join(squareId);
    }
    userItem['last_login_time'] = new Date();
    fn(userItem);
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
  var number = (new Date()).getTime();
  for (var i = 0; i < 4; i++) {
    number += (Math.floor(Math.random()*10)).toString();
  }
  return parseInt(number);
}
