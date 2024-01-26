const ts = require('typescript');
const TJS = require('typescript-json-schema');

// input = folder = ./test
// output = JSON file with []Functions

function getCompilerOptions() {
  return {
    strictNullChecks: true,
    esModuleInterop: true,
    // Add other necessary compiler options here
  };
}

function extractFunctionSignaturesToJsonSchema(fileName) {
  console.log("Preparing to generate schema for file:", fileName);

  // Prepare to generate a schema
  const program = TJS.getProgramFromFiles([fileName], getCompilerOptions());
  const generator = TJS.buildGenerator(program, { required: true });

  if (!generator) {
    console.error("Could not create generator");
    return;
  }

  console.log("Generator created, processing file...");

  // Traverse the AST and extract function signatures
  const sourceFile = program.getSourceFile(fileName);

  if (!sourceFile) {
    console.error(`Failed to load source file: ${fileName}`);
    return;
  }

  console.log(`Successfully loaded file: ${fileName}`);
  const functionSchemas = [];

  sourceFile.forEachChild((node) => {
    console.log("Node type:", ts.SyntaxKind[node.kind]); // Log the type of each node
    if (ts.isFunctionDeclaration(node)) {
      console.log("Processing function declaration node");

      const functionName = node.name ? node.name.text : "anonymous";
      console.log(`Found function: ${functionName}`);

      // Extract parameter types
      const parameters = node.parameters.map(p => {
        const typeName = p.type ? p.type.getText() : 'any';
        let schema = {};
        try {
          schema = generator.getSchemaForSymbol(typeName);
          console.log(`Generated schema for parameter type: ${typeName}`);
        } catch (error) {
          console.error(`Error generating schema for parameter ${typeName}: ${error}`);
        }
        return { name: p.name.getText(), schema };
      });

      // Extract return type
      const returnTypeName = node.type ? node.type.getText() : 'void';
      let returnTypeSchema = {};
      try {
        returnTypeSchema = generator.getSchemaForSymbol(returnTypeName);
        console.log(`Generated schema for return type: ${returnTypeName}`);
      } catch (error) {
        console.error(`Error generating schema for return type ${returnTypeName}: ${error}`);
      }

      functionSchemas.push({
        name: functionName,
        parameters,
        returnType: returnTypeSchema
      });
    } else {
      console.log("Skipping non-function node");
    }
  });

  return functionSchemas;
}

// Replace with the path to your TypeScript file
const tsFileName = './test/getUserInfo.ts'; // Ensure this path is correct
console.log("Reading TypeScript file:", tsFileName);

try {
  const functionSchemas = extractFunctionSignaturesToJsonSchema(tsFileName);
  console.log("Extracted Function Schemas:");
  console.log(JSON.stringify(functionSchemas, null, 2));
} catch (error) {
  console.error(`An error occurred: ${error}`);
}
