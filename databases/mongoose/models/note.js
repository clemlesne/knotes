var Schema = __db_mongoose.Schema,
  ObjectId = Schema.ObjectId;

var noteSchema = new Schema({
  name: { type: String, required: true },
  order: { type: Number, default: 0, required: true },

  noteSections: [{ type: ObjectId, ref: 'note.section' }],

  updatedAt: { type: Date }
});

// MAJ la date à chaque update.
noteSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

var Note = __db_mongoose.model('note', noteSchema);

module.exports = Note;