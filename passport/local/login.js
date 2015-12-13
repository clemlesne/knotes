module.exports = function(passport, AccountModel, LocalStrategy) {
  var bcrypt = require('bcrypt');

  passport.use('local-login', new LocalStrategy({
      passReqToCallback : true
    },

    function(req, username, password, done) {

      // check in mongo if a user with username exists or not
      AccountModel.findOne({ $or: [ { 'local.username':  username }, { 'local.email':  username } ] },
        function(err, user) {

          // In case of any error, return using the done method
          if(err) return next(err);

          // Username does not exist, log error & redirect back
          if(!user) {
            console.log('User Not Found with username ' + username);
            return done(null, false, req.flash('message', 'User Not found.'));
          }

          // User exists but wrong password, log the error
          bcrypt.compare(password, user.local.password.hash, function(err, res) {
            if(!res) {
              console.log('Invalid Password');
              return done(null, false, req.flash('message', 'Invalid Password'));
            }

            return done(null, user);
          });

        }
      );
    }
  ));

  return passport;
};