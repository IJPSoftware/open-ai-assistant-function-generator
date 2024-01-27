import * as ts from 'typescript';
import { generateJsonSchema } from './generate_schema';

function getFunctionComments(node: ts.Node, sourceFile: ts.SourceFile): string {
  let docComments: string[] = [];
  const fullText = sourceFile.getFullText();
  const commentRanges = ts.getLeadingCommentRanges(fullText, node.getFullStart());

  if (commentRanges) {
    for (const range of commentRanges) {
      const commentText = fullText.substring(range.pos, range.end);
      if (commentText.startsWith('/**')) {
        docComments.push(commentText.replace(/\/\*\*|\*\//g, '').trim());
      }
    }
  }
  return docComments.join('\n');
}

function visitFunctionNode(node: ts.Node, sourceFile: ts.SourceFile, obj: any, fileName: string): void {
  if (ts.isFunctionDeclaration(node) && node.name) {
    const comments = getFunctionComments(node, sourceFile);
    const params = node.parameters.map(param => {
      const paramName = param.name.getText(sourceFile);
      const paramType = param.type ? param.type.getText(sourceFile) : 'any';
      return { paramName, paramType };
    });

    const returnType = node.type ? node.type.getText(sourceFile) : 'void';
    obj.functions.push({
      functionName: node.name.text,
      paramType: params.map(p => p.paramType),
      returnType,
      fileName,
      comments,
    });
  }
}

function extractFunctionDetails(fileName: string): any {
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

export { extractFunctionDetails };
