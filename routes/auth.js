module.exports = function(passport) {
  var express = require('express');
  var router = express.Router();

  // Local login
  router.post('/local/login', passport.authenticate('local-login', {
    successRedirect: '/account',
    failureRedirect: '/account/login',
    failureFlash : true
  }));

  // Local signup
  router.post('/local/signup', passport.authenticate('local-signup', {
    successRedirect: '/account',
    failureRedirect: '/account/signup',
    failureFlash : true
  }));

  // Facebook login page
  router.get('/facebook', passport.authenticate('facebook-login', {
    scope: [
      'public_profile',
      'email'
    ]
  }));

  // Facebook login callback
  router.get('/facebook/callback', passport.authenticate('facebook-login', {
    successRedirect: '/account',
    failureRedirect: '/account/login'
  }));

  // Google login page
  router.get('/google', passport.authenticate('google-login', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  }));

  // Google login callback
  router.get('/google/callback', passport.authenticate('google-login', {
    successRedirect: '/account',
    failureRedirect: '/account/login'
  }));

  return router;
};