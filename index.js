var Generator = require('generator-core/lib/generator');

module.exports = function(options) {

  var generator = Generator.createGenerator({ createLogger: () => console});

  process.on("exit", function () {
    generator.shutdown();
  });

  generator.start(options || {});

  return generator;
};