"use strict";
/**
 * CanL3 Completion Provider (T040)
 *
 * Provides IntelliSense auto-completion for CanL3 files
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
exports.CanL3CompletionProvider = void 0;
const vscode = __importStar(require("vscode"));
class CanL3CompletionProvider {
    provideCompletionItems(document, position, token, context) {
        const linePrefix = document.lineAt(position).text.substring(0, position.character);
        const items = [];
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
    getDirectiveCompletions() {
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
    getValueCompletions() {
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
    getDelimiterHints() {
        // Provide hints about delimiter usage
        const hint = new vscode.CompletionItem('Delimiter Info', vscode.CompletionItemKind.Text);
        hint.detail = 'Use consistent delimiters';
        hint.documentation = new vscode.MarkdownString('CanL3 supports multiple delimiters:\n' +
            '- `,` (comma) - most common\n' +
            '- `|` (pipe) - for clarity\n' +
            '- `;` (semicolon) - alternative\n' +
            '- `\\t` (tab) - for TSV-like data');
        return [hint];
    }
}
exports.CanL3CompletionProvider = CanL3CompletionProvider;
//# sourceMappingURL=completion-provider.js.map

