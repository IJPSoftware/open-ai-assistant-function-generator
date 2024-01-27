#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const generate_schema_1 = require("./generate_schema");
const extract_functions_1 = require("./extract_functions");
function listFilesInDirectory(dirPath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const files = fs_1.default.readdirSync(dirPath);
            let functions = [];
            for (const file of files) {
                const filePath = path_1.default.join(dirPath, file);
                let fns = (0, extract_functions_1.extractFunctionDetails)(filePath);
                functions = [...functions, ...fns.functions];
            }
            return functions.map(fn => {
                const jsonSchema = (0, generate_schema_1.generateJsonSchema)(fn.fileName, fn.paramType);
                return {
                    "name": fn.functionName,
                    "description": fn.comments,
                    "parameters": {
                        type: jsonSchema === null || jsonSchema === void 0 ? void 0 : jsonSchema.type,
                        properties: jsonSchema === null || jsonSchema === void 0 ? void 0 : jsonSchema.properties,
                        required: jsonSchema === null || jsonSchema === void 0 ? void 0 : jsonSchema.required,
                    }
                };
            });
        }
        catch (error) {
            console.error(`Error reading directory ${dirPath}: ${error.message}`);
            return []; // Return an empty array in case of an error
        }
    });
}
const dirPath = process.argv[2]; // Get directory path from command line argument
const outputPath = process.argv[3]; // Get output file path from command line argument
if (!dirPath || !outputPath) {
    console.error("Please provide a directory path and an output file path.");
    process.exit(1);
}
listFilesInDirectory(dirPath)
    .then(functions => {
    fs_1.default.writeFileSync(outputPath, JSON.stringify(functions, null, 2), 'utf8');
    console.log(`Output written to ${outputPath}`);
})
    .catch(error => {
    console.error('An error occurred:', error);
});
