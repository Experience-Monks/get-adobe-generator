var child_process = require('child_process');
var EventEmitter = require('events').EventEmitter;
var stream = require('stream');
var createChildProcessMethod = require('./lib/createChildProcessMethod');

var ERR_CANNOT_CONNECT = 'ECONNREFUSED';

module.exports = function(onInit) {

  var control = {};

  // invoke generator-core which will look for plugins in this current director and find
  // this module which is the helper
  var cp = child_process.fork(require.resolve('generator-core'), ['--f=' + __dirname], {
    stdio: [ null, 'pipe', process.stderr ],
    silent: true
  });

  // pipe output to screen
  // cp.stdout.pipe(process.stdout);

  // watch for cannot connect if there is an error send error to onInit
  cp.stdout.on('data', onPhotoshopNotUp);

  // receive messages from the child process which communicates with photoshop
  cp.on('message', onReceiveMethods);

  function onPhotoshopNotUp(chunk) {

    chunk = chunk.toString();

    if(chunk.indexOf(ERR_CANNOT_CONNECT) > -1) {
      onInit(new Error(chunk));
      cp.stdout.removeListener('data', onPhotoshopNotUp);
    }
  }

  function onReceiveMethods(methods) {

    // remove this listener since after this other messages
    // will be in regards to function calls
    cp.removeListener('message', onReceiveMethods);

    // remove this since clearly it was up
    cp.stdout.removeListener('data', onPhotoshopNotUp);

    // create methods which will communicate with the generator
    methods.forEach( function(methodName) {
      control[ methodName ] = createChildProcessMethod(cp, methodName);
    });

    onInit(null, control);
  }
};

// this method will be called by generator-core
module.exports.init = require('./lib/pluginInit');