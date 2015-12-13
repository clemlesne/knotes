module.exports.init = function(callback) {
  var mongoose = require('mongoose');

  mongoose.connect(__config.db.mongoose.url, { user: __config.db.mongoose.user, pass: __config.db.mongoose.pass });

  mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error: '));

  mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
  });

  String.prototype.toObjectId = function() {
    var ObjectId = (require('mongoose').Types.ObjectId);
    return new ObjectId(this.toString());
  };

  mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to : ' + __config.db.mongoose.url);
    callback(mongoose);
  });
};