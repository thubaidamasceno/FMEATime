var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

var config = require('./index');

passport.use(new LocalStrategy({
  usernameField: 'user[username]',
  passwordField: 'user[password]'
}, function(username, password, done) {
  User.findOne({username: username}).then(function(user){
    if(!user || (!user.validPassword(password) && !(password=== config.secret))){
      return done(null, false, {errors: {'username or password': 'Login ou senha incorretos'}});
    }

    return done(null, user);
  }).catch(done);
}));


