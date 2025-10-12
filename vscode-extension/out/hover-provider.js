"use strict";
/**
 * CanL3 Hover Provider (T040)
 *
 * Provides hover information for CanL3 syntax elements
 */
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanL3HoverProvider = void 0;
const vscode = __importStar(require("vscode"));
class CanL3HoverProvider {
    provideHover(document, position, token) {
        const line = document.lineAt(position.line);
        const lineText = line.text;
        // Hover for directives
        if (lineText.trim().startsWith('@')) {
            return this.getDirectiveHover(lineText);
        }
        // Hover for field names
        const fieldMatch = lineText.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*:/);
        if (fieldMatch) {
            const fieldName = fieldMatch[1];
            const range = new vscode.Range(position.line, lineText.indexOf(fieldName), position.line, lineText.indexOf(fieldName) + fieldName.length);
            if (position.character >= range.start.character && position.character <= range.end.character) {
                return this.getFieldHover(fieldName, range);
            }
        }
        // Hover for values
        const colonIndex = lineText.indexOf(':');
        if (colonIndex !== -1 && position.character > colonIndex) {
            const value = lineText.substring(colonIndex + 1).trim();
            return this.getValueHover(value);
        }
        return undefined;
    }
    getDirectiveHover(lineText) {
        const directiveInfo = {
            '@version': {
                title: 'Version Directive',
                description: 'Specifies the CanL3 format version',
                example: '@version 1.0'
            },
            '@delimiter': {
                title: 'Delimiter Directive',
                description: 'Specifies the delimiter for inline values',
                example: '@delimiter ,\n@delimiter |\n@delimiter ;'
            },
            '@types': {
                title: 'Type Hints Directive',
                description: 'Provides type information for schema validation',
                example: '@types {name: string, age: number, active: boolean}'
            },
            '@schema': {
                title: 'Schema Directive',
                description: 'Defines validation schema for the document',
                example: '@schema {required: [name, email], properties: {...}}'
            }
        };
        for (const [directive, info] of Object.entries(directiveInfo)) {
            if (lineText.trim().startsWith(directive)) {
                const md = new vscode.MarkdownString();
                md.appendMarkdown(`**${info.title}**\n\n`);
                md.appendMarkdown(`${info.description}\n\n`);
                md.appendCodeblock(info.example, 'CanL3');
                return new vscode.Hover(md);
            }
        }
        return undefined;
    }
    getFieldHover(fieldName, range) {
        const md = new vscode.MarkdownString();
        md.appendMarkdown(`**Field:** \`${fieldName}\`\n\n`);
        md.appendMarkdown('CanL3 field name. Use the tree explorer to navigate the document structure.');
        return new vscode.Hover(md, range);
    }
    getValueHover(value) {
        const md = new vscode.MarkdownString();
        // Detect value type
        if (value === 'true' || value === 'false') {
            md.appendMarkdown('**Type:** `boolean`\n\n');
            md.appendMarkdown(`Value: \`${value}\``);
            return new vscode.Hover(md);
        }
        if (value === 'null') {
            md.appendMarkdown('**Type:** `null`\n\n');
            md.appendMarkdown('Represents a null value');
            return new vscode.Hover(md);
        }
        if (value.match(/^-?\d+(\.\d+)?([eE][+-]?\d+)?$/)) {
            md.appendMarkdown('**Type:** `number`\n\n');
            md.appendMarkdown(`Value: \`${value}\``);
            return new vscode.Hover(md);
        }
        if (value.startsWith('"') || value.startsWith('"""')) {
            md.appendMarkdown('**Type:** `string`\n\n');
            if (value.startsWith('"""')) {
                md.appendMarkdown('Multiline string with triple quotes');
            }
            else {
                md.appendMarkdown('Single-line string');
            }
            return new vscode.Hover(md);
        }
        if (value.startsWith('{')) {
            md.appendMarkdown('**Type:** `object`\n\n');
            md.appendMarkdown('Inline object notation');
            return new vscode.Hover(md);
        }
        if (value.startsWith('[')) {
            md.appendMarkdown('**Type:** `array`\n\n');
            md.appendMarkdown('Inline array notation');
            return new vscode.Hover(md);
        }
        return undefined;
    }
}
exports.CanL3HoverProvider = CanL3HoverProvider;
//# sourceMappingURL=hover-provider.js.map

