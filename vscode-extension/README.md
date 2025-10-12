# CanL3 VS Code Extension

[![Version](https://img.shields.io/vscode/marketplace/v/CanL3-dev.CanL3-vscode.svg)](https://marketplace.visualstudio.com/items?itemName=CanL3-dev.CanL3-vscode)
[![Installs](https://img.shields.io/vscode/marketplace/i/CanL3-dev.CanL3-vscode.svg)](https://marketplace.visualstudio.com/items?itemName=CanL3-dev.CanL3-vscode)
[![Rating](https://img.shields.io/vscode/marketplace/r/CanL3-dev.CanL3-vscode.svg)](https://marketplace.visualstudio.com/items?itemName=CanL3-dev.CanL3-vscode)

Complete language support for **CanL3** (Token-Optimized Notation Language) files with syntax highlighting, intelligent code completion, validation, and interactive document exploration.

## ðŸ“‹ Table of Contents
- [Features](#-features)
- [Installation](#-installation)
- [Usage](#-usage)
- [Commands](#-commands)
- [Settings](#-settings)
- [Examples](#-examples)
- [Development](#-development)
- [Contributing](#-contributing)
- [License](#-license)

---

## ðŸŒŸ Features

### ðŸŽ¨ Syntax Highlighting (T038) - Complete
- **CanL3 file recognition** - Automatic language mode for `.CanL3` files
- **Comprehensive syntax coloring**:
  - Directives: `@version`, `@delimiter`, `@types`, `@schema`
  - Comments: `# comment lines`
  - Field headers: `key:`, `array[0]:`
  - Strings: double quotes `"..."` and triple quotes `"""..."""`
  - Numbers: integers, decimals, scientific notation
  - Booleans: `true`, `false`
  - Null values: `null`
  - Inline objects: `{key: value, ...}`
  - Inline arrays: `[item1, item2, ...]`
  - Delimiters: `,`, `|`, `;`, `\t`
  - Escape sequences in strings

### ðŸŒ³ Document Explorer (T039) - Complete
- **Interactive tree view** in sidebar
- **Real-time parsing** of CanL3 documents
- **Visual structure navigation**:
  - Collapsible objects and arrays
  - Type icons for all value types
  - Value previews for primitives
  - Array length and object property counts
- **Intelligent tooltips** showing paths and types
- **Auto-refresh** on document changes (debounced)
- **Error display** for invalid CanL3 syntax

### ðŸ§  IntelliSense (T040) - Complete
- **Auto-completion**:
  - Directive suggestions (`@version`, `@delimiter`, etc.)
  - Value completions (`true`, `false`, `null`)
  - Snippet support for strings, objects, and arrays
  - Context-aware suggestions
- **Hover information**:
  - Type detection for all values
  - Directive documentation
  - Field name hints
  - Value type indicators
- **Real-time diagnostics**:
  - Parse error detection with line numbers
  - Duplicate key warnings
  - Inconsistent delimiter detection
  - Schema validation messages

### âš¡ Commands
- **CanL3: Validate Document** - Parse and validate CanL3 syntax
- **CanL3: Format Document** - Round-trip format via encode/decode
- **CanL3: Show Document Tree** - Open tree explorer sidebar

## ðŸ“¦ Installation

### ðŸ›ï¸ From VS Code Marketplace (Recommended)
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for **"CanL3"** or **"CanL3 Language Support"**
4. Click **Install**

### ðŸ”§ From VSIX (Development)
```bash
cd vscode-extension
npm install
npm run compile
npm run package
code --install-extension CanL3-vscode-1.0.0.vsix
```

### ðŸŽ¯ Quick Start
1. Install the extension
2. Create or open a `.CanL3` file
3. Start editing with syntax highlighting and IntelliSense!

## ðŸ’¡ Usage

### ðŸ“ Basic Editing
1. Open any `.CanL3` file
2. Syntax highlighting activates automatically
3. IntelliSense provides suggestions as you type
4. Hover over elements for type information

### ðŸŒ³ Document Explorer
1. Open a `.CanL3` file
2. View the "CanL3 Explorer" in the sidebar
3. Navigate through the document structure
4. Click on elements to see tooltips with paths and values

### âš¡ Commands
Access commands via Command Palette (**Ctrl+Shift+P** / **Cmd+Shift+P**):
- **CanL3: Validate Document** - Check for syntax errors
- **CanL3: Format Document** - Reformat the document
- **CanL3: Show Document Tree** - Open explorer view

### ðŸ§  IntelliSense Features
- Type `@` to see directive completions
- Type `:` after a field name for value suggestions
- Hover over any element to see type and documentation
- Real-time error highlighting in the editor

## ðŸ“š Example

```CanL3
# CanL3 Document Example
@version 1.0
@delimiter ,
@types {name: string, age: number, active: boolean}

# User profile
user:
  name: Alice Johnson
  age: 30
  email: alice@example.com
  active: true

# Inline object notation
settings: {theme: dark, notifications: true}

# Array of users
users[0]:
  id: 1
  name: Bob Smith
  role: admin

users[1]:
  id: 2
  name: Carol Davis
  role: user

# Nested structure
config:
  database:
    host: localhost
    port: 5432
    credentials: {username: admin, password: secret}
  features: [auth, logging, caching]
```

## âš™ï¸ Extension Settings

Configure these settings in VS Code **Settings** or in `.vscode/settings.json`:

```json
{
  "CanL3.validateOnSave": {
    "type": "boolean",
    "default": true,
    "description": "Validate CanL3 documents when saving"
  },
  "CanL3.formatOnSave": {
    "type": "boolean",
    "default": false,
    "description": "Format CanL3 documents when saving"
  },
  "CanL3.maxFileSize": {
    "type": "number",
    "default": 10,
    "description": "Maximum file size for tree view (MB)"
  },
  "CanL3.enableDiagnostics": {
    "type": "boolean",
    "default": true,
    "description": "Enable real-time error diagnostics"
  }
}
```

## ðŸ› ï¸ Development

### Prerequisites
- **Node.js** 18.0.0 or higher
- **VS Code** 1.85.0 or higher
- **TypeScript** 5.0 or higher

### Setup
```bash
# Clone the repository
git clone https://github.com/CanL3-dev/CanL3.git
cd CanL3/vscode-extension

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Run in watch mode
npm run watch

# Package extension
npm run package
```

### Debugging
1. Open the extension folder in VS Code
2. Press **F5** to launch a new Extension Development Host window
3. Test the extension with `.CanL3` files
4. Use **Help > Toggle Developer Tools** for debugging

### Testing
```bash
# Run tests (when available)
npm test

# Check TypeScript compilation
npm run compile
```

## ðŸ“‹ Requirements

- **VS Code**: 1.85.0 or higher
- **CanL3 Library**: Automatically included as dependency

## âš ï¸ Known Issues

- Tree view performance may degrade with very large files (>10K lines)
- Format command does a full encode/decode cycle (may change formatting slightly)
- Diagnostics update on every keystroke (500ms debounced)

## ðŸ“… Release Notes

### 1.0.0 - Production Release

**Complete implementation of T038, T039, and T040:**

ðŸŽ¨ **T038 - Syntax Highlighting**
- âœ… Full TextMate grammar for CanL3 syntax
- âœ… Support for all CanL3 features including inline objects/arrays
- âœ… Proper escape sequence highlighting
- âœ… Directive and delimiter recognition

ðŸŒ³ **T039 - Document Explorer**
- âœ… Interactive tree view with real-time parsing
- âœ… Type-aware icons and tooltips
- âœ… Collapsible structure navigation
- âœ… Error handling for invalid documents

ðŸ§  **T040 - IntelliSense**
- âœ… Auto-completion for directives and values
- âœ… Hover information with type detection
- âœ… Real-time diagnostics (parse errors, duplicate keys, delimiter warnings)
- âœ… Context-aware suggestions

### 0.1.0 - Beta Release
- Initial implementation with basic features
- Syntax highlighting and basic validation

## ðŸ¤ Contributing

We welcome contributions! See the main CanL3 repository:
- **Main Repository**: [github.com/CanL3-dev/CanL3](https://github.com/CanL3-dev/CanL3)
- **Extension Development**: [CONTRIBUTING.md](../CONTRIBUTING.md)

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## ðŸ“„ License

**MIT License** - see [LICENSE](../LICENSE) file for details.

---

## ðŸŒŸ Support

- **Issues**: [GitHub Issues](https://github.com/CanL3-dev/CanL3/issues)
- **Discussions**: [GitHub Discussions](https://github.com/CanL3-dev/CanL3/discussions)
- **Documentation**: [CanL3.dev](https://CanL3.dev)

---

<div align="center">

**Made with â¤ï¸ by the CanL3 Team**

[![CanL3](https://img.shields.io/badge/CanL3-Token--Optimized%20Notation-blue.svg)](https://CanL3.dev)

</div>

