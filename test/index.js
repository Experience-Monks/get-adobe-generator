var getAdobeGenerator = require('./..');

getAdobeGenerator(function(err, generator) {

  if(err) {
    return;
  }

  generator.getOpenDocumentIDs(function(err, ids) {

    console.log('call back', err, ids);

    generator.getDocumentInfo(ids[ 0 ], function(err, info) {

      if(err) {
        console.log(err);
        return;
      }

      console.log(JSON.stringify(info, null, '  '));
    });
  });
});