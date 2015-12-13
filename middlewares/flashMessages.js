module.exports = function flashAddMessage(req, res, next) {

  res.resetMsg = function() {
    console.log('Delete flash session...');
    req.session.flash = undefined;
  };

  res.addMsg = function(context, msg) {

    if(context != 'i' && context != 'e') next('Unknown context \'' + context + '\'');

    console.log('flash > ' + '\'' + context + '\'' + ' : ' + '\'' + msg + '\'');

    if(typeof req.session.flash === 'undefined' || typeof req.session.flash.i === 'undefined' || typeof req.session.flash.e === 'undefined') {
      req.session.flash = {
        i: [ ],
        e: [ ]
      };
    }

    if(typeof res.locals.flash === 'undefined') {
      res.locals.flash = {
        i: [ ],
        e: [ ]
      };
    }

    if(context == 'i') {
      req.session.flash.i.push(msg);
      res.locals.flash.i = req.session.flash.i;

    } else if(context == 'e') {
      req.session.flash.e.push(msg);
      res.locals.flash.e = req.session.flash.e;
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