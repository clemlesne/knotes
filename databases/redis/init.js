module.exports.init = function(callback) {
  var redis = require('redis');
  var client = redis.createClient(__config.db.redis.port, __config.db.redis.host);

  var doAfterConnect = function() {
    client.on('error', console.error.bind(console, 'Redis connection error: '));

    client.on('ready', function() {
      console.log('Redis default connection open to: ' + __config.db.mongoose.url);
      callback(client);
    });
  };

  if(typeof __config.db.redis.password === 'undefined') {
    doAfterConnect();

  } else {
    client.auth(__config.db.redis.password, function() {
      doAfterConnect();
    });
  }
};