module.exports = function(passport, AccountModel) {
  var FacebookStrategy = require('passport-facebook').Strategy;

  passport = require('./login.js')(passport, AccountModel, FacebookStrategy);

  return passport;
};