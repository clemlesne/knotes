var Schema = __db_mongoose.Schema,
  ObjectId = Schema.ObjectId;

var noteSectionSchema = new Schema({
  name: {type: String, required: true},
  order: {type: Number, default: 0, required: true},

  content: {type: String},

  noteSectionsRaw: [ {type: ObjectId, required: true, ref: 'note.section.raw'} ],

  updatedAt: {type: Date}

}, {
  collection: 'notes.sections'
});

// MAJ la date à chaque update.
noteSectionSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});


var NoteSection = __db_mongoose.model('note.section', noteSectionSchema);

module.exports = NoteSection;