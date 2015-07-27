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

var generator = getAdobeGenerator();

generator.getOpenDocumentIDs()
.then(function(ids) {

  return generator.getDocumentInfo(ids[ 0 ]);
})
.then(function(info) {

  console.log('there are', info.layers.length, 'layers');

  return generator.getPixmap(info.id, info.layers[0].id, {});
})
.then(function(pixmap) {

  console.log('got the pixmap');
});

generator.onPhotoshopEvent('toolChanged', function(tool) {
  console.log('toolChanged', tool);
});

generator.onPhotoshopEvent('currentDocumentChanged', function(info) {
  console.log('currentDocumentChanged', info);
});

generator.onPhotoshopEvent('imageChanged', function(info) {
  console.log('imageChanged', info);
});

generator.onPhotoshopEvent('close', function() { 
  console.log('photoshop closed');
});
```

## Usage

[![NPM](https://nodei.co/npm/get-adobe-generator.png)](https://www.npmjs.com/package/get-adobe-generator)

#### `var generator = require('get-adobe-generator')([options]);`

`generator` is a [Adobes Generator instance](https://github.com/adobe-photoshop/generator-core/blob/master/lib/generator.js). 

For more info and documentation on the generator checkout the generator code at: 
https://github.com/adobe-photoshop/generator-core/blob/master/lib/generator.js

## License

MIT, see [LICENSE.md](http://github.com/mikkoh/get-adobe-generator/blob/master/LICENSE.md) for details.
