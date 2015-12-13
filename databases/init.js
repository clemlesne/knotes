module.exports.init = function(callback) {
  var path = require('path');

  require(path.join(__basedir, 'databases', 'mongoose', 'init.js')).init(function(mongoose) {

    require(path.join(__basedir, 'databases', 'redis', 'init.js')).init(function(redis) {

      callback(mongoose, redis);
    });
  });

  process.on('SIGINT', function() {
    __db_redis.quit(function () {
      console.log('*Redis* default connection disconnected through app termination...');

      __db_mongoose.connection.close(function () {
        console.log('*Mongoose* default connection disconnected through app termination...');

        process.exit(0);
      });
    });

  });
};