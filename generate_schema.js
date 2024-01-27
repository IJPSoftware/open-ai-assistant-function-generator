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
exports.generateJsonSchema = void 0;
const TJS = __importStar(require("typescript-json-schema"));
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
        return undefined;
    }
    // Generate the schema for the specified interface
    const schema = generator.getSchemaForSymbol(interfaceName);
    return schema;
}
exports.generateJsonSchema = generateJsonSchema;
