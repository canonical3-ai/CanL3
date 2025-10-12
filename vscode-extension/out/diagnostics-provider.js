"use strict";
/**
 * CanL3 Diagnostics Provider (T040)
 *
 * Provides real-time validation and diagnostics for CanL3 files
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
exports.CanL3DiagnosticsProvider = void 0;
const vscode = __importStar(require("vscode"));
const CanL3_1 = require("CanL3");
class CanL3DiagnosticsProvider {
    constructor() {
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection('CanL3');
    }
    updateDiagnostics(document) {
        if (document.languageId !== 'CanL3') {
            return;
        }
        const diagnostics = [];
        const text = document.getText();
        // Try to parse the document
        try {
            (0, CanL3_1.decodeCanL3)(text);
            // If successful, clear diagnostics
            this.diagnosticCollection.set(document.uri, []);
        }
        catch (error) {
            // Parse error - create diagnostic
            const diagnostic = this.createDiagnosticFromError(error, document);
            if (diagnostic) {
                diagnostics.push(diagnostic);
            }
            this.diagnosticCollection.set(document.uri, diagnostics);
        }
        // Additional checks
        diagnostics.push(...this.checkDuplicateKeys(document));
        diagnostics.push(...this.checkInconsistentDelimiters(document));
        this.diagnosticCollection.set(document.uri, diagnostics);
    }
    createDiagnosticFromError(error, document) {
        if (!(error instanceof Error)) {
            return null;
        }
        const message = error.message;
        // Try to extract line number from error message
        const lineMatch = message.match(/line (\d+)/i);
        const line = lineMatch ? parseInt(lineMatch[1], 10) - 1 : 0;
        const range = new vscode.Range(line, 0, line, document.lineAt(Math.min(line, document.lineCount - 1)).text.length);
        const diagnostic = new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Error);
        diagnostic.source = 'CanL3';
        return diagnostic;
    }
    checkDuplicateKeys(document) {
        const diagnostics = [];
        const keys = new Map();
        // Find all field definitions
        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            const match = line.text.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*:/);
            if (match) {
                const key = match[1];
                if (!keys.has(key)) {
                    keys.set(key, []);
                }
                keys.get(key).push(i);
            }
        }
        // Report duplicates
        keys.forEach((lines, key) => {
            if (lines.length > 1) {
                lines.forEach((lineNum) => {
                    const line = document.lineAt(lineNum);
                    const keyStart = line.text.indexOf(key);
                    const range = new vscode.Range(lineNum, keyStart, lineNum, keyStart + key.length);
                    const diagnostic = new vscode.Diagnostic(range, `Duplicate key '${key}' found (appears ${lines.length} times)`, vscode.DiagnosticSeverity.Warning);
                    diagnostic.source = 'CanL3';
                    diagnostic.code = 'duplicate-key';
                    diagnostics.push(diagnostic);
                });
            }
        });
        return diagnostics;
    }
    checkInconsistentDelimiters(document) {
        const diagnostics = [];
        const delimiters = new Set();
        // Find all inline delimiters
        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i).text;
            // Skip directives and comments
            if (line.trim().startsWith('@') || line.trim().startsWith('#')) {
                continue;
            }
            // Check for inline values (after colon)
            const colonIndex = line.indexOf(':');
            if (colonIndex !== -1) {
                const value = line.substring(colonIndex + 1);
                // Detect delimiters
                if (value.includes(',') && !value.includes('"')) {
                    delimiters.add(',');
                }
                if (value.includes('|') && !value.includes('"')) {
                    delimiters.add('|');
                }
                if (value.includes(';') && !value.includes('"')) {
                    delimiters.add(';');
                }
                if (value.includes('\t')) {
                    delimiters.add('\\t');
                }
            }
        }
        // Warn if multiple delimiter types detected
        if (delimiters.size > 1) {
            const diagnostic = new vscode.Diagnostic(new vscode.Range(0, 0, 0, document.lineAt(0).text.length), `Inconsistent delimiters detected: ${Array.from(delimiters).join(', ')}. Consider using @delimiter directive.`, vscode.DiagnosticSeverity.Information);
            diagnostic.source = 'CanL3';
            diagnostic.code = 'inconsistent-delimiters';
            diagnostics.push(diagnostic);
        }
        return diagnostics;
    }
    dispose() {
        this.diagnosticCollection.dispose();
    }
}
exports.CanL3DiagnosticsProvider = CanL3DiagnosticsProvider;
//# sourceMappingURL=diagnostics-provider.js.map

