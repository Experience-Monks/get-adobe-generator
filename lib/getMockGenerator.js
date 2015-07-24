var EventEmitter = require('events').EventEmitter;
var createChildProcessMethod = require('./createChildProcessMethod');

module.exports = function getMockGenerator(cp, methods) {
  var generator = new EventEmitter();
  var listeners = {};
  var listenerID = 0;

  // create methods which will communicate with the generator
  methods.forEach( function(methodName) {

    if(!generator[ methodName ] && methodName.charAt(0) !== '_') {
      generator[ methodName ] = createChildProcessMethod(cp, methodName);  
    }
  });

  generator.on('removeListener', function(event, listener) {

    var id = getListenerId(listener);

    if(id) {

      cp.send({
        type: 'event',
        ev: event,
        action: 'remove',
        id: id
      });

      delete listeners[ id ];
    }
  });

  generator.on('newListener', function(event, listener) {

    var id = getListenerId(listener);

    if(!id) {

      id = ++listenerID;

      cp.send({
        type: 'event',
        ev: event,
        action: 'add',
        id: id
      });

      listeners[ id ] = listener;
    }
  });

  cp.on('message', function(message) {

    var listener = listeners[ message.id ];

    if(message.type === 'event' && listener) {

      listener.apply(null, message.args);
    }
  });

  return generator;

  function getListenerId(listener) {
    for(var i in listeners) {
      if(listeners[ i ] === listener) {
        return i;
      }
    }
  }
};