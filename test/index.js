var getAdobeGenerator = require('./..');

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