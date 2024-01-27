#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { generateJsonSchema } from './generate_schema';
import { extractFunctionDetails } from './extract_functions';

interface FunctionDetail {
    functionName: string;
    paramType: string; // Update this type based on actual data structure
    returnType: string; // Update this type based on actual data structure
    fileName: string;
    comments: string;
}

async function listFilesInDirectory(dirPath: string): Promise<any[]> {
    try {
        const files = fs.readdirSync(dirPath);
        let functions: FunctionDetail[] = [];

        for (const file of files) {
            const filePath = path.join(dirPath, file);
            let fns = extractFunctionDetails(filePath);
            functions = [...functions, ...fns.functions];
        }

        return functions.map(fn => {
            const jsonSchema = generateJsonSchema(fn.fileName, fn.paramType);
            return {
                "name": fn.functionName,
                "description": fn.comments,
                "parameters": {
                    type: jsonSchema?.type,
                    properties: jsonSchema?.properties,
                    required: jsonSchema?.required,
                }
            };
        });
    } catch (error) {
        console.error(`Error reading directory ${dirPath}: ${(error as Error).message}`);
        return []; // Return an empty array in case of an error
    }
}

const dirPath = process.argv[2]; // Get directory path from command line argument
const outputPath = process.argv[3]; // Get output file path from command line argument

if (!dirPath || !outputPath) {
    console.error("Please provide a directory path and an output file path.");
    process.exit(1);
}

listFilesInDirectory(dirPath)
    .then(functions => {
        fs.writeFileSync(outputPath, JSON.stringify(functions, null, 2), 'utf8');
        console.log(`Output written to ${outputPath}`);
    })
    .catch(error => {
        console.error('An error occurred:', error);
    });
