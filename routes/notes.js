var express = require('express');
var router = express.Router();

var path = require('path');
var notesController = require(path.join(__basedir, 'controllers', 'notesController.js'));


router.get('/', function(req, res, next) {
  notesController.renderNotesList(req, res, next);
});

router.post('/delete/:noteID', function(req, res, next) {
  notesController.deleteNoteById(req, res, next);
});

router.get('/:noteID', function(req, res, next) {
  notesController.renderNoteById(req, res, next);
});

router.post('/create', function(req, res, next) {
  notesController.createNote(req, res, next);
});

router.get('/:noteID/nsection/:offset', function(req, res, next) {
  notesController.displayJsonSectionOfNoteByOffset(req, res, next);
});

router.post('/:noteID/nsection/:offset', function(req, res, next) {
  notesController.displayJsonSectionOfNoteByOffset(req, res, next);
});

router.get('/:noteID/section/:sectionID/update', function(req, res, next) {
  notesController.renderUpdateSectionOfNote(req, res, next);
});

router.post('/:noteID/section/:sectionID/update', function(req, res, next) {
  notesController.updateSectionOfNote(req, res, next);
});

router.get('/:noteID/section/create', function(req, res, next) {
  notesController.renderCreateSection(req, res, next);
});

router.post('/:noteID/section/create', function(req, res, next) {
  notesController.createSection(req, res, next);
});

module.exports = router;
