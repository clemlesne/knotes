module.exports = function(passport, AccountModel) {
  var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

  passport = require('./login.js')(passport, AccountModel, GoogleStrategy);

  return passport;
};