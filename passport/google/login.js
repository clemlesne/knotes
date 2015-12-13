module.exports = function(passport, AccountModel, GoogleStrategy) {

  passport.use('google-login', new GoogleStrategy({
      clientID: __config.auth.google.clientID,
      clientSecret: __config.auth.google.clientSecret,
      callbackURL: __config.auth.google.callbackURL
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
          var profilePhotos = [];

          if(typeof profile.emails !== 'undefined') {
            profile.emails.forEach(function (element, index, array) {
              console.log(element);
              profileEmails.push({
                value: element.value,
                type: element.type
              });
            });

            profileEmail = profileEmails[0].value;
          }

          if(typeof profile.photos !== 'undefined') {
            profile.photos.forEach(function (element, index, array) {
              profilePhotos.push({
                value: element.value
              });
            });
          }

          account = new AccountModel({
            local: {
              name: {
                first: profile.name.givenName,
                last: profile.name.familyName
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
              emails: profileEmails,
              photos: profilePhotos
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