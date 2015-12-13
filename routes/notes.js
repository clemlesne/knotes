var express = require('express');
var router = express.Router();

var path = require('path');
var marked = require('marked');
var highlight = require('highlight.js');
var ObjectId = require('mongoose').Types.ObjectId;

var NoteSectionRawModel = require(path.join(__basedir, 'databases', 'mongoose', 'models', 'noteSectionRaw.js'));
var NoteSectionModel = require(path.join(__basedir, 'databases', 'mongoose', 'models','noteSection.js'));
var NoteModel = require(path.join(__basedir, 'databases', 'mongoose', 'models','note.js'));


router.get('/', function(req, res, next) {
  NoteModel.find({ _id: { $in: req.user.notes } })
    .exec(function(err, notes) {
      if(err) next(err);

      console.log(notes);

      res.doRender('pages/notes', { notes: notes });
    });
});

router.post('/delete/:noteID', function(req, res, next) {
  var paramNoteID = req.params.noteID.toObjectId();
  var user = req.user;

  var index = user.notes.indexOf(paramNoteID);

  if (index > -1) {
    user.notes.splice(index, 1);

    user.save(function(err) {
      if(err) {
        res.addMsgI('Error during suppress.');
        return next(err);
      }

      res.addMsgI('Delete done.');
    });

  } else {
    res.addMsgE('Unable to find requested noteID.');
  }

  res.end();
});

router.get('/:noteID', function(req, res, next) {
  NoteModel.findOne({ _id: req.params.noteID.toObjectId() })
    .populate({
      path: 'noteSections',
      options: {
        sort: '-updatedAt',
        select: '-content'
      }
    })
    .exec(function(err, note) {
      if(err) next(err);

      console.log(note);

      res.doRender('pages/note', { note: note });
    });
});

router.post('/create', function(req, res, next) {
  var user = req.user;

  var note = new NoteModel({
    name: req.body.name
  });

  note.save(function (err) {
    if(err) {
      res.addMsgE('Error during creating.');
      return next(err);
    }

    user.notes.push(note._id);

    user.save(function(err) {
      if(err) {
        res.addMsgE('Error during saving user.');
        return next(err);
      }

      res.addMsgI('Success adding note !');
      res.redirect('/notes');
      res.end();
    });
  });
});

router.post('/:noteID/nsection/:offset', function(req, res, next) {
  var paramNoteID = req.params.noteID.toObjectId();
  var paramNoteSectionOffset = req.params.offset;

  NoteModel.findOne({ _id: paramNoteID })
    .select('noteSections')
    .populate({
      path: 'noteSections',
      options: {
        sort: '-updatedAt',
        select: 'content',
        limit: 1,
        skip: paramNoteSectionOffset
      }
    })
    .exec(function(err, note) {
      if(err) next(err);

      console.log(note);

      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(note.noteSections[0]));
      res.end();
    });
});

router.get('/:noteID/section/:sectionID/update', function(req, res, next) {
  var searchSectionId = req.params.sectionID.toObjectId();

  NoteModel.findOne({ _id: req.params.noteID.toObjectId(), noteSections: searchSectionId })
    .exec(function(err, note) {
      if(err) next(err);

      NoteSectionModel.findOne({ _id: searchSectionId })
        .select('-content')
        .populate({
          path: 'noteSectionsRaw',
          options: {
            sort: '-updatedAt',
            limit: 1
          }
        })
        .exec(function(err, noteSection) {
          if(err) next(err);
          console.log(noteSection);

          res.doRender('pages/noteSectionUpdate', { note: note, noteSection: noteSection });
        });
    });
});

router.post('/:noteID/section/:sectionID/update', function(req, res, next) {
  var searchSectionId = req.params.sectionID.toObjectId();
  var inputSectionContent = req.body.section_content;

  NoteModel.findOne({ _id: req.params.noteID.toObjectId(), noteSections: searchSectionId })
    .exec(function(err, note) {
      if(err) next(err);

      NoteSectionModel.findOne({ _id: searchSectionId })
        .select('-content')
        .exec(function(err, noteSection) {
          if(err) next(err);
          console.log(noteSection);

          // Update begin
          var noteSectionRaw = new NoteSectionRawModel({
            type: 0,
            content: inputSectionContent
          });

          noteSectionRaw.save(function(err) {
            if(err) return next(err);

            highlight.configure({
              classPrefix: 'mkd__code__',
              tabReplace: '<span class="mkd__code__indent">\x09</span>'
            });

            marked.setOptions({
              breaks: true,
              sanitize: true,
              highlight: function(code) {
                return highlight.highlightAuto(code).value;
              }
            });

            noteSection.content = marked(inputSectionContent);
            noteSection.noteSectionsRaw.push(noteSectionRaw._id);

            noteSection.save(function(err) {
              if(err) return next(err);

              res.redirect('/notes/' + note._id);
              res.end();
            });
          });
        });
    });
});

router.get('/:noteID/section/create', function(req, res, next) {
  NoteModel.findOne({ _id: req.params.noteID.toObjectId() })
    .exec(function(err, note) {
      if(err) next(err);

      console.log(note);

      res.doRender('pages/noteSectionCreate', { note: note });
    });
});

router.post('/:noteID/section/create', function(req, res, next) {
  var inputNoteId = req.params.noteID;
  var inputSectionName = req.body.section_name;
  var inputSectionContent = req.body.section_content;

  highlight.configure({
    classPrefix: 'mkd__code__',
    tabReplace: '<span class="mkd__code__indent">\x09</span>'
  });

  marked.setOptions({
    breaks: true,
    sanitize: true,
    highlight: function(code) {
      return highlight.highlightAuto(code).value;
    }
  });

  var inputSectionContentFormatted = marked(inputSectionContent);

  var noteSectionRaw = new NoteSectionRawModel({
    type: 0,
    content: inputSectionContent
  });

  noteSectionRaw.save(function(err) {
    if(err) return next(err);

    var noteSection = new NoteSectionModel({
      name: inputSectionName,
      content: inputSectionContentFormatted,
      noteSectionsRaw: [ noteSectionRaw._id ]
    });

    noteSection.save(function(err) {
      if(err) return next(err);

      NoteModel.findOne({ _id: inputNoteId.toObjectId() })
        .exec(function(err, note) {
          if(err) next(err);

          note.noteSections.push(noteSection._id);

          note.save(function(err) {
            if(err) return next(err);

            res.redirect('/notes/' + note._id);
            res.end();
          });
        });
    });
  });
});

module.exports = router;
