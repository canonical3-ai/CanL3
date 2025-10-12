"use strict";
/**
 * CanL3 VS Code Extension (T038-T040)
 *
 * Provides language support for CanL3 files including:
 * - Syntax highlighting (T038)
 * - Document Explorer (T039)
 * - IntelliSense (T040)
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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const tree_provider_1 = require("./tree-provider");
const completion_provider_1 = require("./completion-provider");
const hover_provider_1 = require("./hover-provider");
const diagnostics_provider_1 = require("./diagnostics-provider");
const CanL3_1 = require("CanL3");
/**
 * Extension activation
 */
function activate(context) {
    console.log('CanL3 extension activated');
    // Register commands
    context.subscriptions.push(vscode.commands.registerCommand('CanL3.validateDocument', validateDocument));
    context.subscriptions.push(vscode.commands.registerCommand('CanL3.formatDocument', formatDocument));
    context.subscriptions.push(vscode.commands.registerCommand('CanL3.showDocumentTree', showDocumentTree));
    // Register document tree provider (T039)
    const treeDataProvider = new tree_provider_1.CanL3TreeDataProvider();
    vscode.window.registerTreeDataProvider('CanL3DocumentTree', treeDataProvider);
    // Refresh tree when active editor changes
    vscode.window.onDidChangeActiveTextEditor(() => {
        treeDataProvider.refresh();
    });
    // Refresh tree when document changes (debounced)
    let timeout;
    vscode.workspace.onDidChangeTextDocument((event) => {
        if (event.document.languageId === 'CanL3') {
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(() => {
                treeDataProvider.refresh();
            }, 500); // 500ms debounce
        }
    });
    // Register completion provider (T040)
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider('CanL3', new completion_provider_1.CanL3CompletionProvider(), '@', ':', ','));
    // Register hover provider (T040)
    context.subscriptions.push(vscode.languages.registerHoverProvider('CanL3', new hover_provider_1.CanL3HoverProvider()));
    // Register diagnostics provider (T040)
    const diagnosticsProvider = new diagnostics_provider_1.CanL3DiagnosticsProvider();
    context.subscriptions.push(diagnosticsProvider);
    // Update diagnostics on document open/change
    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument((document) => {
        diagnosticsProvider.updateDiagnostics(document);
    }));
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument((event) => {
        diagnosticsProvider.updateDiagnostics(event.document);
    }));
    // Update diagnostics for already open documents
    vscode.workspace.textDocuments.forEach((document) => {
        diagnosticsProvider.updateDiagnostics(document);
    });
}
/**
 * Validate CanL3 document
 */
async function validateDocument() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor');
        return;
    }
    const document = editor.document;
    if (document.languageId !== 'CanL3') {
        vscode.window.showErrorMessage('Not a CanL3 file');
        return;
    }
    try {
        const text = document.getText();
        (0, CanL3_1.decodeCanL3)(text); // Validate by parsing
        vscode.window.showInformationMessage('âœ“ CanL3 document is valid');
    }
    catch (error) {
        vscode.window.showErrorMessage(`âœ— Validation error: ${error instanceof Error ? error.message : String(error)}`);
    }
}
/**
 * Format CanL3 document
 */
async function formatDocument() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor');
        return;
    }
    const document = editor.document;
    if (document.languageId !== 'CanL3') {
        vscode.window.showErrorMessage('Not a CanL3 file');
        return;
    }
    try {
        const text = document.getText();
        const parsed = (0, CanL3_1.decodeCanL3)(text);
        const formatted = (0, CanL3_1.encodeCanL3)(parsed);
        // Replace entire document
        const edit = new vscode.WorkspaceEdit();
        const fullRange = new vscode.Range(document.positionAt(0), document.positionAt(text.length));
        edit.replace(document.uri, fullRange, formatted);
        await vscode.workspace.applyEdit(edit);
        vscode.window.showInformationMessage('âœ“ CanL3 document formatted');
    }
    catch (error) {
        vscode.window.showErrorMessage(`âœ— Formatting error: ${error instanceof Error ? error.message : String(error)}`);
    }
}
/**
 * Show document tree view
 */
async function showDocumentTree() {
    // Tree view is always visible in sidebar
    vscode.window.showInformationMessage('Check CanL3 Explorer in the sidebar');
}
/**
 * Extension deactivation
 */
function deactivate() {
    console.log('CanL3 extension deactivated');
}
//# sourceMappingURL=extension.js.map

