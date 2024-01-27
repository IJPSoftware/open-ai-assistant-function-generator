"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractFunctionDetails = void 0;
const ts = __importStar(require("typescript"));
function getFunctionComments(node, sourceFile) {
    let docComments = [];
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
function visitFunctionNode(node, sourceFile, obj, fileName) {
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
function extractFunctionDetails(fileName) {
    const sourceCode = ts.sys.readFile(fileName);
    if (!sourceCode) {
        console.error(`Failed to read file: ${fileName}`);
        return;
    }
    const sourceFile = ts.createSourceFile(fileName, sourceCode, ts.ScriptTarget.Latest, true);
    const details = { functions: [] };
    ts.forEachChild(sourceFile, node => visitFunctionNode(node, sourceFile, details, fileName));
    return details;
}
exports.extractFunctionDetails = extractFunctionDetails;
