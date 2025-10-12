/**
 * CanL3 Diagnostics Provider (T040)
 *
 * Provides real-time validation and diagnostics for CanL3 files
 */

import * as vscode from 'vscode';
import { decodeCanL3 } from 'CanL3';

export class CanL3DiagnosticsProvider {
  private diagnosticCollection: vscode.DiagnosticCollection;

  constructor() {
    this.diagnosticCollection = vscode.languages.createDiagnosticCollection('CanL3');
  }

  public updateDiagnostics(document: vscode.TextDocument): void {
    if (document.languageId !== 'CanL3') {
      return;
    }

    const diagnostics: vscode.Diagnostic[] = [];
    const text = document.getText();

    // Try to parse the document
    try {
      decodeCanL3(text);
      // If successful, clear diagnostics
      this.diagnosticCollection.set(document.uri, []);
    } catch (error) {
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

  private createDiagnosticFromError(
    error: unknown,
    document: vscode.TextDocument
  ): vscode.Diagnostic | null {
    if (!(error instanceof Error)) {
      return null;
    }

    const message = error.message;

    // Try to extract line number from error message
    const lineMatch = message.match(/line (\d+)/i);
    const line = lineMatch ? parseInt(lineMatch[1], 10) - 1 : 0;

    const range = new vscode.Range(
      line,
      0,
      line,
      document.lineAt(Math.min(line, document.lineCount - 1)).text.length
    );

    const diagnostic = new vscode.Diagnostic(
      range,
      message,
      vscode.DiagnosticSeverity.Error
    );

    diagnostic.source = 'CanL3';
    return diagnostic;
  }

  private checkDuplicateKeys(document: vscode.TextDocument): vscode.Diagnostic[] {
    const diagnostics: vscode.Diagnostic[] = [];
    const keys = new Map<string, number[]>();

    // Find all field definitions
    for (let i = 0; i < document.lineCount; i++) {
      const line = document.lineAt(i);
      const match = line.text.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*:/);

      if (match) {
        const key = match[1];
        if (!keys.has(key)) {
          keys.set(key, []);
        }
        keys.get(key)!.push(i);
      }
    }

    // Report duplicates
    keys.forEach((lines, key) => {
      if (lines.length > 1) {
        lines.forEach((lineNum) => {
          const line = document.lineAt(lineNum);
          const keyStart = line.text.indexOf(key);
          const range = new vscode.Range(lineNum, keyStart, lineNum, keyStart + key.length);

          const diagnostic = new vscode.Diagnostic(
            range,
            `Duplicate key '${key}' found (appears ${lines.length} times)`,
            vscode.DiagnosticSeverity.Warning
          );

          diagnostic.source = 'CanL3';
          diagnostic.code = 'duplicate-key';
          diagnostics.push(diagnostic);
        });
      }
    });

    return diagnostics;
  }

  private checkInconsistentDelimiters(document: vscode.TextDocument): vscode.Diagnostic[] {
    const diagnostics: vscode.Diagnostic[] = [];
    const delimiters = new Set<string>();

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
      const diagnostic = new vscode.Diagnostic(
        new vscode.Range(0, 0, 0, document.lineAt(0).text.length),
        `Inconsistent delimiters detected: ${Array.from(delimiters).join(', ')}. Consider using @delimiter directive.`,
        vscode.DiagnosticSeverity.Information
      );

      diagnostic.source = 'CanL3';
      diagnostic.code = 'inconsistent-delimiters';
      diagnostics.push(diagnostic);
    }

    return diagnostics;
  }

  public dispose(): void {
    this.diagnosticCollection.dispose();
  }
}


