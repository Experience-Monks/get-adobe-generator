module.exports = function(generator, info, logger) {

  var listeners = {};

  // receive messages from parent which can be method
  // calls or then adding events to the generator
  process.on('message', function(message) {

    switch(message.type) {
      case 'method':
        handleMethod(generator, message);
      break;

      case 'event':
        handleEvent(generator, message, listeners);
      break;
    }
  });

  // The following will initialize the mock generator
  sendMethods(parseMethods(generator));
};

function handleMethod(generator, message) {

  var result = generator[ message.method ].apply(generator, message.args);  
  
  if(result.then) {

    result
    .then( function() {

      process.send( {
        type: 'method',
        id: message.id,
        result: Array.prototype.slice.call(arguments)
      });
    })
    .catch( function(error) {

      process.send( {
        type: 'method',
        id: message.id,
        error: error
      });
    });
  } else {
    process.send( {
      type: 'method',
      id: message.id,
      result: result
    });
  }
}

function handleEvent(generator, message, listeners) {

  var listener;

  if(message.action === 'add') {

    listener = onSendEventResultToParent.bind(undefined, message.id);

    listeners[ message.id ] = listener;

    // close is the only event coming directly from generator
    // everything else comes through `addPhotoshopEventListener`
    if(message.ev !== 'close') {
      generator.addPhotoshopEventListener(message.ev, listener);  
    } else {
      generator.on(message.ev, listener);
    }
    
  } else {

    listener = listeners[ message.id ];
    delete listeners[ message.id ];
    
    // close is the only event coming directly from generator
    // everything else comes through `addPhotoshopEventListener`
    if(message.ev !== 'close') {
      generator.removePhotoshopEventListener(message.ev, listener);
    } else {
      generator.removeListener(message.ev, listener);
    }
  }
}

function onSendEventResultToParent(id) {

  process.send( {
    type: 'event',
    id: id,
    args: Array.prototype.slice.call(arguments, 1)
  });
}

function parseMethods(generator) {
  var methods = [];

  for(var i in generator) {
    if(typeof generator[ i ] === 'function' && i.charAt(0) !== '_') {
      methods.push(i);
    }
  }

  return methods;
}

function sendMethods(methods) {
  process.send(methods);
}