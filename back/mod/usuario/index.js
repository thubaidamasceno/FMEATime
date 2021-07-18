var router = require('express').Router();
var mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario');
var Usrupdate = mongoose.model('Usrupdate');
var User = mongoose.model('User');
var auth = require('../../routes/auth');

module.exports = router;
  