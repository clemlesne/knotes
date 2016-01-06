var express = require('express');
var router = express.Router();

var path = require('path');
var notesController = require(path.join(__basedir, 'controllers', 'notesController.js'));


router.get('/', function(req, res, next) {
  if(req.isAuthenticated()) {
    notesController.renderNotesList(req, res, next);

  } else {
    res.doRender('pages/index');
  }
});

module.exports = router;
