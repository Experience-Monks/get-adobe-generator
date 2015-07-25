# get-adobe-generator

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

This module gives you a straightforward way to access Adobe Generator's `generator` object to create tools outside of Photoshop. Basically it's an easier way to interact with Photoshop through Node.

The following example will work if you have a newish vesion of photoshop and you've enabled generators:
```
Open Photoshop, go to 

Photoshop -> 
Preferences -> 
Plug-ins 

and click Enable Remote Connections and set password to “password” string.
```

## Example
```javascript
var getAdobeGenerator = require('get-adobe-generator');

getAdobeGenerator(function(err, generator) {

  if(err) {
    console.log('error', err);
    return;
  }

  generator.getOpenDocumentIDs(function(err, ids) {

    console.log('there are ', ids.length, 'open files in photoshop');

    generator.getDocumentInfo(ids[ 0 ], function(err, info) {

      console.log('there are', info.layers.length, 'layers');

      generator.getPixmap(info.id, info.layers[0].id, {}, function(err, pixmap) {

        console.log('got the pixmap');
      });
    });
  });

  // generatorMenuChanged is another event we could listen to
  
  generator.on('toolChanged', function(tool) {
    console.log('toolChanged', tool);
  });

  generator.on('currentDocumentChanged', function(info) {
    console.log('currentDocumentChanged', info);
  });

  generator.on('imageChanged', function(info) {
    console.log('imageChanged', info);
  });

  generator.on('close', function() { 
    console.log('photoshop closed');
  });
});
```

## Details Of How This Works

How this module works is by running [`generator-core`](https://www.npmjs.com/package/generator-core) in a `child_process` and pointing it to look for plugins in the `get-adobe-generator` directory. After this setup `get-adobe-generator` will return an `EventEmitter` instance which maps `generator` functions to the `generator` instance in the `generator-core` child process.

## Usage

[![NPM](https://nodei.co/npm/get-adobe-generator.png)](https://www.npmjs.com/package/get-adobe-generator)

#### `require('get-adobe-generator')(cb);`

This module expects a node style callback which will return an error if Photoshop is closed or generators are not enabled. If Photoshop is open and generators are enabled it will return `null` for the error parameter and a `generator` instance for the second parameter.

Example:
```javascript
require('get-adobe-generator')(function(err, generator) {
    if(err) {
        console.log('photoshop is closed');
    }

    // do something with generator
});
```

#### `generator`

`generator` is based on [Adobes Generator instance](https://github.com/adobe-photoshop/generator-core/blob/master/lib/generator.js). 

This module communicates with an Adobe `generator` via `ChildProcess.send` so basically all functions which accepts and return JSON like parameters will work.

The following is a list of methods which you can use on generator. For more info and documentation checkout the generator code at: 

https://github.com/adobe-photoshop/generator-core/blob/master/lib/generator.js

```
evaluateJSXString
alert
getPhotoshopPath
getPhotoshopExecutableLocation
getPhotoshopLocale
getPhotoshopVersion
addMenuItem
toggleMenu
getMenuState
getOpenDocumentIDs
getDocumentInfo
getLayerSettingsForPlugin
setLayerSettingsForPlugin
getDocumentSettingsForPlugin
setDocumentSettingsForPlugin
extractDocumentSettings
subscribeToPhotoshopEvents
getPixmap
getDocumentPixmap
getLayerShape
getDeepBounds
getPixmapParams
savePixmap
getSVG
getGuides
shutdown
isConnected
getPluginMetadata
checkPluginCompatibility
getCustomOptions
setCustomOptions
updateCustomOption
deleteCustomOption
startWebsocketServer
stopWebsocketServer
```

## License

MIT, see [LICENSE.md](http://github.com/mikkoh/get-adobe-generator/blob/master/LICENSE.md) for details.
