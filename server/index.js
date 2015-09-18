var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var debug = require('debug')('talkin:server');
var http = require('http');
var protocols = require('./protocols');
var utils = require('./utils');

var app = express();
var rootDir = '';
app.set('env', 'development');

// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

rootDir = app.get('env') === 'development' ? 'app' : 'dist';
app.use(express.static(path.join(__dirname, rootDir)));

app.get('/', function (req, res){
  res.sendFile(path.join(__dirname, rootDir, '../index.html'));
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
var squareId = utils.pickId();
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
    onlineUsers = {},
    userMap = {};


/**
 * Listen for socket connection
 */
var io = require('socket.io').listen(server);

io.on('connection', function (socket) {
  console.log('A user connected. ID is ' + socket.id);

  socket.on('disconnect', function () {
    console.log('A user disconnected.');
    try {
      disconnect(socket);
    } catch (e) {
      console.log(e);
    }
  });

  /**
   * Message events
   */
  socket.on('message:get', function (channelId, fn) {
    getMessage(channelId, fn, socket);
  });

  socket.on('message:send', function (packet) {
    try {
      sendMessage(packet);
    } catch (e) {
      console.log(e);
    }   
  });

  socket.on('message:remove', function (packet) {
    try {
      removeMessage(packet);
    } catch (e) {
      console.log(e);
    }
  });
  
  /**
   * Channel events
   */
  socket.on('channel:get', function (channel, fn) {
    getChannel(channel, fn, socket);
  });


  socket.on('channel:join', function (channel, fn) {
    try {
      joinChannel(channel, fn, socket);
    } catch (e) {
      console.log(e);
    }
  });

  /**
   * User events
   */
  socket.on('user:add', function (user, fn) {
    try {
      addUser(user, fn, socket);
    } catch (e) {
      console.log(e);
    }
  });

  socket.on('user:get', function (user, fn) {
    try {
      getUser(user, fn, socket);
    } catch (e) {
      console.log(e);
    }
  });
});

server.listen(port);

/* Sockets processing functions */

/**
 * Message operations
 */

function getMessage(channelId, fn, socket) {
  console.log('message reading');
  var messageList = {
      messages: messages[channelId],
      channel_id: channelId
  };
  fn.call(socket, messageList);
}

function sendMessage(packet) {
  if (packet && packet.channel_id in channels) {
      console.log(packet.channel_id);
      var avatarId = 0;
      if (packet.user_id in userMap) {
        avatarId = users[userMap[packet.user_id]].avatar_id;
      }

      var message = protocols.message.construct(packet);
      message.avatar_id = avatarId;

      if (!messages[packet.channel_id])
        messages[packet.channel_id] = [];
      messages[packet.channel_id].push(message);
      var messageItem = {
        message: message,
        channel_id: packet.channel_id
      }
      io.sockets.to(packet.channel_id).emit('message:recv', messageItem);
    }
}

function removeMessage(packet) {
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
}

/**
 * Channel operations
 */

function getChannel(channel, fn, socket) {
  console.log('channel getting');
  // socket.emit('channel:get', channels); 
  fn.call(socket, channels);
}

function joinChannel(channel, fn, socket) {
  console.log('A user joined channel ' + channel.id);
    var channelItem = {};
    if (channel.id && channel.id in channels) {
      // If a valid channel id provided, then join it.
      console.log(JSON.stringify(channels));
      channel.name = channels[channel.id];
      channelItem = channel;
    } else {
      // Otherwise generate a new channel.
      var randId = utils.pickId();
      channelItem = {
        name: channel.name,
        id: randId
      };
      console.log('not:' + JSON.stringify(channels));
      channels[channelItem.id] = channelItem.name;
    }
    socket.join(channelItem.id);
    fn.call(socket, channelItem);
}


/**
 * User operations
 */

function addUser(user, fn, socket) {
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
    // var randId = utils.pickId();
    userItem = protocols.user.construct(user);
    users.push(userItem);

    userMap[userItem.id] = users.length - 1;
    // Let the user join the default channel
    // socket.join(squareId);
  }
  userItem['last_login_time'] = new Date();

  if (!(socket.id in onlineUsers)) {
    onlineUsers[socket.id] = userItem.id;
  }
  io.sockets.emit('user:get', getOnlineUsers());
  fn.call(socket, userItem);
}

function getUser(user, fn, socket) {
  console.log('getting users ' + JSON.stringify(onlineUsers));
  fn.call(socket, getOnlineUsers());
}

function disconnect(socket) {
  delete onlineUsers[socket.id];
  io.sockets.emit('user:get', getOnlineUsers());
}

function getOnlineUsers() {
  var userList = [];
  for (var user in onlineUsers) {
    if (onlineUsers[user] in userMap) {
      var userIndex = userMap[onlineUsers[user]];
      userList.push(users[userIndex]);
    }
  }
  return userList;
}

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

