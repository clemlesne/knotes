module.exports = function(passport, AccountModel, LocalStrategy) {
  var bcrypt = require('bcrypt');

  passport.use('local-signup', new LocalStrategy({
      passReqToCallback : true
    },

    function(req, username, password, done) {

      findOrCreateUser = function() {
        // find a user in Mongo with provided username
        AccountModel.findOne({ username: username }, function(err, user) {

          // In case of any error return
          if(err) {
            console.log('Error in SignUp: '+err);
            return next(err);
          }

          // already exists
          if(user) {
            console.log('User already exists');
            return done(null, false, req.flash('message','User Already Exists'));

          } else {
            var account = new AccountModel();
            account.local.username = username;
            account.local.name.first = req.body.firstname;
            account.local.name.last = req.body.lastname;
            account.local.email = req.body.email;

            bcrypt.genSalt(10, function(err, salt) {
              bcrypt.hash(req.body.password, salt, function(err, hash) {

                account.local.password.hash = hash;
                account.local.password.salt = salt;

                // save the account
                account.save(function(err) {
                  if (err){
                    console.log('Error in Saving user: '+err);
                    throw err;
                  }

                  console.log('User Registration succesful');
                  return done(null, account);
                });
              });
            });

          }
        });
      };

      // Delay the execution of findOrCreateUser and execute
      // the method in the next tick of the event loop
      process.nextTick(findOrCreateUser);
    }
  ));

  return passport;
};