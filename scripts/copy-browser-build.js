#!/usr/bin/env node
/**
 * Copy browser build to website/js folder
 * Run after: npm run build:browser
 */

import { copyFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

try {
  // Ensure website/js directory exists
  const jsDir = join(rootDir, 'website', 'js');
  mkdirSync(jsDir, { recursive: true });

  // Copy IIFE bundle
  const src = join(rootDir, 'dist', 'browser', 'CanL3.iife.js');
  const dest = join(jsDir, 'CanL3.iife.js');

  copyFileSync(src, dest);
  console.log('âœ… Copied CanL3.iife.js to website/js/');
} catch (error) {
  console.error('âŒ Error copying browser build:', error.message);
  process.exit(1);
}

