/**
 * CanL3 Completion Provider (T040)
 *
 * Provides IntelliSense auto-completion for CanL3 files
 */

import * as vscode from 'vscode';

export class CanL3CompletionProvider implements vscode.CompletionItemProvider {
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
    const linePrefix = document.lineAt(position).text.substring(0, position.character);
    const items: vscode.CompletionItem[] = [];

    // Directive completions
    if (linePrefix.trim().startsWith('@') || linePrefix.trim() === '') {
      items.push(...this.getDirectiveCompletions());
    }

    // Value completions
    if (linePrefix.includes(':')) {
      items.push(...this.getValueCompletions());
    }

    // Delimiter completions
    if (context.triggerCharacter === ',') {
      items.push(...this.getDelimiterHints());
    }

    return items;
  }

  private getDirectiveCompletions(): vscode.CompletionItem[] {
    const directives = [
      {
        label: '@version',
        detail: 'CanL3 version directive',
        documentation: 'Specify the CanL3 format version',
        insertText: '@version 1.0'
      },
      {
        label: '@delimiter',
        detail: 'Delimiter directive',
        documentation: 'Specify the delimiter for inline values (comma, pipe, tab, semicolon)',
        insertText: '@delimiter ,'
      },
      {
        label: '@type',
        detail: 'Type directive (deprecated)',
        documentation: 'Legacy type hint (use @types instead)',
        insertText: '@type '
      },
      {
        label: '@types',
        detail: 'Type schema directive',
        documentation: 'Specify type hints for fields',
        insertText: '@types {$1}'
      },
      {
        label: '@schema',
        detail: 'Schema directive',
        documentation: 'Specify schema validation rules',
        insertText: '@schema {$1}'
      }
    ];

    return directives.map(d => {
      const item = new vscode.CompletionItem(d.label, vscode.CompletionItemKind.Keyword);
      item.detail = d.detail;
      item.documentation = new vscode.MarkdownString(d.documentation);
      item.insertText = new vscode.SnippetString(d.insertText);
      return item;
    });
  }

  private getValueCompletions(): vscode.CompletionItem[] {
    const values = [
      {
        label: 'true',
        kind: vscode.CompletionItemKind.Value,
        detail: 'Boolean true'
      },
      {
        label: 'false',
        kind: vscode.CompletionItemKind.Value,
        detail: 'Boolean false'
      },
      {
        label: 'null',
        kind: vscode.CompletionItemKind.Value,
        detail: 'Null value'
      },
      {
        label: '""',
        kind: vscode.CompletionItemKind.Value,
        detail: 'Empty string',
        insertText: new vscode.SnippetString('"$1"')
      },
      {
        label: '"""',
        kind: vscode.CompletionItemKind.Snippet,
        detail: 'Multiline string',
        insertText: new vscode.SnippetString('"""\n$1\n"""')
      },
      {
        label: '{}',
        kind: vscode.CompletionItemKind.Snippet,
        detail: 'Inline object',
        insertText: new vscode.SnippetString('{$1}')
      },
      {
        label: '[]',
        kind: vscode.CompletionItemKind.Snippet,
        detail: 'Inline array',
        insertText: new vscode.SnippetString('[$1]')
      }
    ];

    return values.map(v => {
      const item = new vscode.CompletionItem(v.label, v.kind);
      item.detail = v.detail;
      if (v.insertText) {
        item.insertText = v.insertText;
      }
      return item;
    });
  }

  private getDelimiterHints(): vscode.CompletionItem[] {
    // Provide hints about delimiter usage
    const hint = new vscode.CompletionItem('Delimiter Info', vscode.CompletionItemKind.Text);
    hint.detail = 'Use consistent delimiters';
    hint.documentation = new vscode.MarkdownString(
      'CanL3 supports multiple delimiters:\n' +
      '- `,` (comma) - most common\n' +
      '- `|` (pipe) - for clarity\n' +
      '- `;` (semicolon) - alternative\n' +
      '- `\\t` (tab) - for TSV-like data'
    );
    return [hint];
  }
}


