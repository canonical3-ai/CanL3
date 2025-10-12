/**
 * CanL3 VS Code Extension (T038-T040)
 *
 * Provides language support for CanL3 files including:
 * - Syntax highlighting (T038)
 * - Document Explorer (T039)
 * - IntelliSense (T040)
 */

import * as vscode from 'vscode';
import { CanL3TreeDataProvider } from './tree-provider';
import { CanL3CompletionProvider } from './completion-provider';
import { CanL3HoverProvider } from './hover-provider';
import { CanL3DiagnosticsProvider } from './diagnostics-provider';
import { decodeCanL3, encodeCanL3 } from 'CanL3';

/**
 * Extension activation
 */
export function activate(context: vscode.ExtensionContext) {
  console.log('CanL3 extension activated');

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('CanL3.validateDocument', validateDocument)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('CanL3.formatDocument', formatDocument)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('CanL3.showDocumentTree', showDocumentTree)
  );

  // Register document tree provider (T039)
  const treeDataProvider = new CanL3TreeDataProvider();
  vscode.window.registerTreeDataProvider('CanL3DocumentTree', treeDataProvider);

  // Refresh tree when active editor changes
  vscode.window.onDidChangeActiveTextEditor(() => {
    treeDataProvider.refresh();
  });

  // Refresh tree when document changes (debounced)
  let timeout: NodeJS.Timeout | undefined;
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
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      'CanL3',
      new CanL3CompletionProvider(),
      '@', ':', ','
    )
  );

  // Register hover provider (T040)
  context.subscriptions.push(
    vscode.languages.registerHoverProvider('CanL3', new CanL3HoverProvider())
  );

  // Register diagnostics provider (T040)
  const diagnosticsProvider = new CanL3DiagnosticsProvider();
  context.subscriptions.push(diagnosticsProvider);

  // Update diagnostics on document open/change
  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument((document) => {
      diagnosticsProvider.updateDiagnostics(document);
    })
  );

  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((event) => {
      diagnosticsProvider.updateDiagnostics(event.document);
    })
  );

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
    decodeCanL3(text); // Validate by parsing
    vscode.window.showInformationMessage('âœ“ CanL3 document is valid');
  } catch (error) {
    vscode.window.showErrorMessage(
      `âœ— Validation error: ${error instanceof Error ? error.message : String(error)}`
    );
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
    const parsed = decodeCanL3(text);
    const formatted = encodeCanL3(parsed);

    // Replace entire document
    const edit = new vscode.WorkspaceEdit();
    const fullRange = new vscode.Range(
      document.positionAt(0),
      document.positionAt(text.length)
    );
    edit.replace(document.uri, fullRange, formatted);
    await vscode.workspace.applyEdit(edit);

    vscode.window.showInformationMessage('âœ“ CanL3 document formatted');
  } catch (error) {
    vscode.window.showErrorMessage(
      `âœ— Formatting error: ${error instanceof Error ? error.message : String(error)}`
    );
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
export function deactivate() {
  console.log('CanL3 extension deactivated');
}


