const ts = require('typescript');
const { generateJsonSchema } = require('./generate_schema');

function getFunctionComments(node, sourceFile) {
  let docComments = [];
  const fullText = sourceFile.getFullText();
  const commentRanges = ts.getLeadingCommentRanges(fullText, node.getFullStart());

  if (commentRanges) {
    for (const range of commentRanges) {
      const commentText = fullText.substring(range.pos, range.end);
      // Check if it's a TSDoc comment
      if (commentText.startsWith('/**')) {
        docComments.push(commentText.replace(/\/\*\*|\*\//g, '').trim());
      }
    }
  }
  return docComments.join('\n');
}

function visitFunctionNode(node, sourceFile, obj, fileName) {
  // Check if the node is a function declaration
  if (ts.isFunctionDeclaration(node) && node.name) {
    // Process parameters
    const comments = getFunctionComments(node, sourceFile);
    const params = node.parameters.map(param => {
      const paramName = param.name.getText(sourceFile);
      const paramType = param.type ? param.type.getText(sourceFile) : 'any';
      return { paramName, paramType };
    });

    // Process return type
    const returnType = node.type ? node.type.getText(sourceFile) : 'void';
    obj.functions.push({
      functionName: node.name.text,
      paramType: params[0].paramType,
      returnType,
      fileName,
      comments,
    });
  }
}

function extractFunctionDetails(fileName) {
  const sourceCode = ts.sys.readFile(fileName);
  if (!sourceCode) {
    console.error(`Failed to read file: ${fileName}`);
    return;
  }

  const sourceFile = ts.createSourceFile(
    fileName,
    sourceCode,
    ts.ScriptTarget.Latest,
    true,
  );

  const details = { functions: [] };
  ts.forEachChild(sourceFile, node => visitFunctionNode(node, sourceFile, details, fileName));
  return details;
}

module.exports = { extractFunctionDetails }