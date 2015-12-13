module.exports = function(passport) {
  var path = require('path');
  var AccountModel = require(path.join(__basedir, 'databases', 'mongoose', 'models', 'account.js'));

  // Local Strategy
  passport = require('./local/init.js')(passport, AccountModel);
  // Facebook Strategy
  passport = require('./facebook/init.js')(passport, AccountModel);
  // Google Strategy
  passport = require('./google/init.js')(passport, AccountModel);

  return passport;
};