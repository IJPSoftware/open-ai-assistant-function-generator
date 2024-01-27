const TJS = require('typescript-json-schema');

function generateJsonSchema(tsFilePath, interfaceName) {
  // Specify TypeScript compiler options
  const compilerOptions = {
    strictNullChecks: true
  };

  // Generate a program from the given file path
  const program = TJS.getProgramFromFiles([tsFilePath], compilerOptions);

  // Generate a schema generator
  const generator = TJS.buildGenerator(program, {
    required: true
  });

  if (!generator) {
    console.error("Could not create schema generator.");
    return;
  }

  // Generate the schema for the specified interface
  const schema = generator.getSchemaForSymbol(interfaceName);
  return schema;
}

module.exports = { generateJsonSchema };
