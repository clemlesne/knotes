module.exports = function(passport, AccountModel, FacebookStrategy) {

  passport.use('facebook-login', new FacebookStrategy({
      clientID: __config.auth.facebook.clientID,
      clientSecret: __config.auth.facebook.clientSecret,
      callbackURL: __config.auth.facebook.callbackURL
    },

    function(accessToken, refreshToken, profile, done) {

      AccountModel.findOne({
        openid: {
          $elemMatch: {
            provider: profile.provider,
            id: profile.id
          }
        }

      }, function(err, account) {
        if(err) return next(err);

        if(!account) {
          var profileEmails = [];
          var profileEmail = undefined;

          if(typeof profile.emails !== 'undefined') {
            profile.emails.forEach(function(element, index, array) {
              profileEmails.push({
                value: element.value,
                type: element.type
              });
            });

            profileEmail = profileEmails[0].value;
          }

          account = new AccountModel({
            local: {
              name: {
                first: profile.givenName,
                last: profile.familyName
              },
              email: profileEmail
            },

            openid: {
              provider: profile.provider,
              id: profile.id,
              displayName: profile.displayName,
              name: {
                familyName: profile.familyName,
                givenName: profile.givenName,
                middleName: profile.middleName
              },
              emails: profileEmails
            }
          });

          account.save(function(err) {
            if(err) console.log(err);
            return done(err, account);
          });

        } else {
          return done(err, account);
        }
      });
    }
  ));

  return passport;
};