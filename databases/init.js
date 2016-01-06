module.exports.init = function(callback) {
  var path = require('path');
  var debug = require('debug')('knotes:app');

  require(path.join(__basedir, 'databases', 'mongoose', 'init.js')).init(function(mongoose) {
    require(path.join(__basedir, 'databases', 'redis', 'init.js')).init(function(redis) {
      callback(mongoose, redis);
    });
  });

  process.on('SIGINT', function() {
    __db_redis.quit(function () {
      debug('*Redis* default connection disconnected through app termination...');

      __db_mongoose.connection.close(function () {
        debug('*Mongoose* default connection disconnected through app termination...');
        process.exit(0);
      });
    });

  });
};