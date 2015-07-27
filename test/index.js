var getAdobeGenerator = require('./..');

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