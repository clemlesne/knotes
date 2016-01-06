module.exports = function flashAddMessage(req, res, next) {
  var debug = require('debug')('knotes:app');

  res.locals.resetMsg = function() {
    debug('Delete flash session...');
    req.session.flash = undefined;
  };

  res.initMsg = function() {
    res.locals.flash = req.session.flash;
  };

  res.addMsg = function(context, msg) {

    if(context != 'i' && context != 'e') next('Unknown context \'' + context + '\'');

    debug('flash > ' + '\'' + context + '\'' + ' : ' + '\'' + msg + '\'');

    if(typeof req.session.flash === 'undefined' || typeof req.session.flash.i === 'undefined' || typeof req.session.flash.e === 'undefined') {
      req.session.flash = {
        i: [ ],
        e: [ ]
      };
    }

    if(context == 'i') {
      req.session.flash.i.push(msg);

    } else if(context == 'e') {
      req.session.flash.e.push(msg);
    }
  };

  res.addMsgI = function(msg) {
    res.addMsg('i', msg);
  };

  res.addMsgE = function(msg) {
    res.addMsg('e', msg);
  };

  next();
};