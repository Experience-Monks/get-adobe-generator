module.exports = function(generator, info, logger) {

  var methods = parseMethods(generator);
  sendMethods(methods);

  // receive messages from parent which are all function calls
  // on generator
  process.on('message', function(message) {

    var result = generator[ message.method ].apply(generator, message.args);

    if(result.then) {
      result
      .then( function() {

        process.send( {
          id: message.id,
          result: Array.prototype.slice.call(arguments)
        });
      })
      .catch( function(error) {

        process.send( {
          id: message.id,
          error: error
        });
      });
    } else {
      process.send( {
        id: message.id,
        result: result
      });
    }
  });
};

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