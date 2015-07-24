module.exports = function(cp, methodName) {

  return function() {

    var args = Array.prototype.slice.call(arguments);
    var onData = args[ args.length - 1 ];
    var id = methodName + Math.random() * Date.now();

    if(typeof onData !== 'function') {
      throw new Error('Last parameter must be a callback');
    } else {
      // remove callback from array
      args.pop();
    }

    cp.on('message', function getMessage(message) {

      if(message.type === 'method' && message.id === id) {

        if(message.error) {

          onData(new Error(message.error));          
        } else {

          message.result.unshift(null);

          onData.apply(null, message.result);
        }
      }
    });

    cp.send({
      type: 'method',
      id: id,
      method: methodName,
      args: args
    });
  };
};