#!/usr/bin/env node
import { readFileSync, writeFileSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const files = [
  'dist/browser-core.js',
  'dist/browser-simple.js',
  'dist/browser.js',
  'dist/cli.js',
  'dist/decode.js',
  'dist/encode.js',
  'dist/index.js',
  'dist/parser.js'
];

function fixImports(content) {
  // Fix all relative imports to add .js extensions
  let fixed = content;

  // Handle static imports
  fixed = fixed.replace(/from "(\.\/[^"]+)"/g, (match, path) => {
    // Skip if already has .js extension
    if (path.endsWith('.js')) {
      return match;
    }
    // Skip if it's a Node.js built-in module or external package
    if (!path.startsWith('./') && !path.startsWith('../')) {
      return match;
    }
    return `from "${path}.js"`;
  });

  // Handle dynamic imports
  fixed = fixed.replace(/await import\('(\.\/[^']+)'\)/g, (match, path) => {
    // Skip if already has .js extension
    if (path.endsWith('.js')) {
      return match;
    }
    // Check if it's a directory import (ends with /)
    if (path.endsWith('/')) {
      return `await import('${path}index.js')`;
    }
    // Check if path is a directory by checking if it has corresponding directory
    try {
      const stats = statSync(`dist/${path}`);
      if (stats.isDirectory()) {
        return `await import('${path}/index.js')`;
      }
    } catch (e) {
      // File doesn't exist, assume it's a module
    }
    // Special case: optimization is always a directory
    if (path === './optimization') {
      return `await import('./optimization/index.js')`;
    }
    return `await import('${path}.js')`;
  });

  return fixed;
}

files.forEach(file => {
  try {
    const content = readFileSync(file, 'utf8');
    const fixed = fixImports(content);

    if (content !== fixed) {
      writeFileSync(file, fixed, 'utf8');
      console.log(`✅ Fixed imports in ${file}`);
    } else {
      console.log(`ℹ️  No changes needed in ${file}`);
    }
  } catch (error) {
    console.log(`❌ Error processing ${file}:`, error.message);
  }
});

console.log('🎉 Import fixing complete!');