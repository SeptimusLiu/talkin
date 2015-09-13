var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  name: String,
  note: String,
  last_login_time: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);