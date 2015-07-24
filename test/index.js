var getAdobeGenerator = require('./..');
var fs = require('fs');

getAdobeGenerator(function(err, generator) {

  if(err) {
    console.log('error', err);
    return;
  }

  generator.getOpenDocumentIDs(function(err, ids) {

    console.log('console log there are ', idx.length, 'open files in photoshop');

    generator.getDocumentInfo(ids[ 0 ], function(err, info) {

      console.log('got info. There are', info.layers.length, 'layers');

      generator.getPixmap(info.id,info.layers[0].id,{}, function(err, pixmap) {

        console.log('got the pixelmap');
        // fs.writeFileSync('layerOutput.json', JSON.stringify(pixmap, null, '  '), 'utf-8');
      });
    });
  });

  // this is another event which hasn't been implemented yes
  // generatorMenuChanged
  
  generator.on('toolChanged', function() {
    console.log('toolChanged', arguments);
  });

  generator.on('currentDocumentChanged', function() {
    console.log('currentDocumentChanged', arguments);
  });

  generator.on('imageChanged', function() {
    console.log('imageChanged', arguments);
  });

  generator.on('close', function() { 
    console.log('photoshop closed');
  });
});