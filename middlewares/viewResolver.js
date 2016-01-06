module.exports = function viewResolver(req, res, next) {
  var path = require('path');

  res.doRender = function(name, parameters) {
    var app = req.app;

    app.set('views', path.join(__basedir, 'views'));
    app.set('view engine', 'jade');

    res.initMsg();
    res.render(name, parameters);
  };

  next();
};