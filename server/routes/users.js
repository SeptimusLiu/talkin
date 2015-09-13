var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/User');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var user = new User({name: 'lyd'});
  user.save(function(err, user) {
  	if (err) 
  	  console.error(err);
  });
  res.send('respond with a resource');
});

module.exports = router;
