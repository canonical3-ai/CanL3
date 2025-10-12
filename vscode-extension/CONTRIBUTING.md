# Contributing to CanL3 VS Code Extension

Thank you for your interest in contributing to the CanL3 VS Code extension! This document provides guidelines for contributing to the extension development.

## ðŸ—ï¸ Project Structure

```
vscode-extension/
â”œâ”€â”€ src/                          # TypeScript source code
â”‚   â”œâ”€â”€ extension.ts              # Main extension entry point
â”‚   â”œâ”€â”€ tree-provider.ts          # Document explorer tree view (T039)
â”‚   â”œâ”€â”€ completion-provider.ts    # IntelliSense completion (T040)
â”‚   â”œâ”€â”€ hover-provider.ts         # Hover information (T040)
â”‚   â””â”€â”€ diagnostics-provider.ts   # Real-time validation (T040)
â”œâ”€â”€ syntaxes/                     # TextMate grammar
â”‚   â””â”€â”€ CanL3.tmLanguage.json      # Syntax highlighting rules (T038)
â”œâ”€â”€ resources/                    # Extension assets
â”‚   â””â”€â”€ CanL3-icon.svg            # Extension icon
â”œâ”€â”€ out/                          # Compiled JavaScript output
â”œâ”€â”€ package.json                  # Extension manifest
â”œâ”€â”€ tsconfig.json                 # TypeScript configuration
â””â”€â”€ README.md                     # Extension documentation
```

## ðŸš€ Getting Started

### Prerequisites
- **Node.js** 18.0.0 or higher
- **VS Code** 1.85.0 or higher
- **TypeScript** 5.0 or higher
- **Git** and a GitHub account

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/CanL3-dev/CanL3.git
   cd CanL3/vscode-extension
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run compile
   ```

4. **Run in development mode**
   ```bash
   # Open in VS Code
   code .

   # Press F5 to launch Extension Development Host
   ```

5. **Test the extension**
   - Create a new file with `.CanL3` extension
   - Test syntax highlighting, IntelliSense, and tree view
   - Use Developer Tools for debugging (Help > Toggle Developer Tools)

## ðŸ§ª Testing

### Manual Testing
- Create test files with various CanL3 features
- Test syntax highlighting for all language constructs
- Verify IntelliSense completions and hover information
- Check tree view navigation and tooltips
- Test validation with malformed CanL3 documents

### Test Areas

#### T038 - Syntax Highlighting
- âœ… Directives (`@version`, `@delimiter`, etc.)
- âœ… Comments (`# line comments`)
- âœ… Field names and colons
- âœ… String values (single and multiline)
- âœ… Number, boolean, and null values
- âœ… Inline objects and arrays
- âœ… Delimiters and escape sequences

#### T039 - Document Explorer
- âœ… Tree view parsing and display
- âœ… Collapsible objects and arrays
- âœ… Type-aware icons
- âœ… Tooltips with paths and values
- âœ… Error handling for invalid documents
- âœ… Performance with large files

#### T040 - IntelliSense
- âœ… Directive completions (`@`)
- âœ… Value completions after `:`
- âœ… String, object, and array snippets
- âœ… Hover information for directives and values
- âœ… Real-time diagnostics and error reporting

## ðŸ”§ Development Workflow

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Edit TypeScript files in `src/`
   - Update grammar rules in `syntaxes/`
   - Test thoroughly

3. **Compile and test**
   ```bash
   npm run compile
   # Test in VS Code (F5)
   ```

4. **Package for testing**
   ```bash
   npm run package
   # Install the generated .vsix file
   code --install-extension CanL3-vscode-1.0.0.vsix
   ```

### Code Style Guidelines

- **TypeScript**: Use strict mode and proper typing
- **Naming**: Use camelCase for variables, PascalCase for classes
- **Comments**: Document all public APIs and complex logic
- **Error Handling**: Provide clear error messages and proper fallbacks

### Extension Guidelines

- **Performance**: Avoid expensive operations in main thread
- **Memory**: Dispose resources properly and prevent memory leaks
- **User Experience**: Provide helpful error messages and tooltips
- **APIs**: Use VS Code APIs correctly and follow best practices

## ðŸ› Reporting Issues

When reporting bugs, please include:

- **VS Code version** and operating system
- **CanL3 extension version**
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Sample CanL3 content** that causes the issue
- **Console errors** or screenshots (if applicable)

Use the [GitHub Issues](https://github.com/CanL3-dev/CanL3/issues) with the `extension` label.

## ðŸ’¡ Feature Requests

For new features:

1. **Check existing issues** to avoid duplicates
2. **Provide clear use cases** and requirements
3. **Consider user experience** and implementation complexity
4. **Discuss the feature** in issues before implementation

## ðŸ“ Extension Features

### Core Tasks

- **T038 - Syntax Highlighting**: Maintain and enhance TextMate grammar
- **T039 - Document Explorer**: Improve tree view performance and UX
- **T040 - IntelliSense**: Enhance completion, hover, and diagnostics

### Enhancement Opportunities

- **Schema Validation**: Integrate with CanL3 schema files
- **Formatting Options**: Add customizable formatting settings
- **Code Folding**: Implement folding for large CanL3 documents
- **Go to Definition**: Support navigation within CanL3 files
- **Live Preview**: Add a preview panel for CanL3 content

### Performance Improvements

- **Large File Support**: Optimize parsing and tree view for big files
- **Memory Usage**: Reduce memory footprint of extension
- **Startup Time**: Minimize extension loading time

## ðŸ”„ Release Process

### Version Bumping
- **Patch (0.0.x)**: Bug fixes, documentation updates
- **Minor (0.x.0)**: New features, breaking changes in extension APIs
- **Major (x.0.0)**: Major architectural changes

### Release Checklist

1. **Update version** in `package.json`
2. **Update CHANGELOG.md** with changes
3. **Test thoroughly** across different scenarios
4. **Update documentation** if needed
5. **Build and package** the extension:
   ```bash
   npm run compile
   npm run package
   ```
6. **Test the .vsix package** in a clean VS Code instance
7. **Create a release** on GitHub
8. **Publish to marketplace** (if authorized)

## ðŸ“š Resources

### VS Code Extension Development
- [Extension API](https://code.visualstudio.com/api)
- [Extension Manifest](https://code.visualstudio.com/api/references/extension-manifest)
- [Testing Extensions](https://code.visualstudio.com/api/working-with-extensions/testing-extension)
- [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)

### CanL3 Documentation
- [Main README](../README.md)
- [CanL3 Specification](../docs/SPECIFICATION.md)
- [API Documentation](../docs/API.md)

### TextMate Grammars
- [TextMate Grammar Guide](https://macromates.com/manual/en/language_grammars)
- [VS Code Grammar Documentation](https://code.visualstudio.com/api/language-extensions/language-configuration-guide)

## ðŸ¤ Community

- **Issues**: [GitHub Issues](https://github.com/CanL3-dev/CanL3/issues)
- **Discussions**: [GitHub Discussions](https://github.com/CanL3-dev/CanL3/discussions)
- **Main Repository**: [CanL3-dev/CanL3](https://github.com/CanL3-dev/CanL3)

## ðŸ“œ Code of Conduct

Please be respectful and constructive in all interactions. Follow the main CanL3 project's [Code of Conduct](../CONTRIBUTING.md#code-of-conduct).

---

Thank you for contributing to the CanL3 VS Code extension! ðŸš€

*For questions about extension development, please tag issues with `extension` and `question` labels.*
