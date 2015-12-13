var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res) {
  res.doRender('pages/account');
});

/* GET login page. */
router.get('/login', function(req, res) {
  // Display the Login page with any flash message, if any
  res.doRender('pages/login');
});

/* GET Registration Page */
router.get('/signup', function(req, res){
  res.doRender('pages/register');
});

/* Handle Logout */
router.get('/signout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;