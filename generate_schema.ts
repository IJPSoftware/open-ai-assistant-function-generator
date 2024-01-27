import * as TJS from 'typescript-json-schema';
import { Program, JsonSchemaGenerator } from 'typescript-json-schema';

function generateJsonSchema(tsFilePath: string, interfaceName: string): TJS.Definition | undefined {
  // Specify TypeScript compiler options
  const compilerOptions: TJS.CompilerOptions = {
    strictNullChecks: true
  };

  // Generate a program from the given file path
  const program: Program = TJS.getProgramFromFiles([tsFilePath], compilerOptions);

  // Generate a schema generator
  const generator: JsonSchemaGenerator | null = TJS.buildGenerator(program, {
    required: true
  });

  if (!generator) {
    console.error("Could not create schema generator.");
    return undefined;
  }

  // Generate the schema for the specified interface
  const schema: TJS.Definition  = generator.getSchemaForSymbol(interfaceName);
  return schema;
}

export { generateJsonSchema };
