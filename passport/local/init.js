module.exports = function(passport, AccountModel) {
  var LocalStrategy = require('passport-local').Strategy;

  passport = require('./login.js')(passport, AccountModel, LocalStrategy);
  passport = require('./signup.js')(passport, AccountModel, LocalStrategy);

  // Passport serialization
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    AccountModel.findById(id, function(err, user) {
      done(err, user);
    });
  });

  return passport;
};