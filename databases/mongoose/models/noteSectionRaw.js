var Schema = __db_mongoose.Schema;

var noteSectionRawSchema = new Schema({
  type: {type: Number, required: true},
  content: {type: String, required: true},

  updatedAt: {type: Date}

}, {
  collection: 'notes.sections.raw'
});

// MAJ la date à chaque update.
noteSectionRawSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

var NoteSectionRaw = __db_mongoose.model('note.section.raw', noteSectionRawSchema);

module.exports = NoteSectionRaw;