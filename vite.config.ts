/**
 * Vite configuration for browser builds
 *
 * Optimized for tree-shaking to reduce bundle size
 */

import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/browser-core.ts'),
      name: 'CanL3',
      formats: ['es', 'umd', 'iife'],
      fileName: (format) => {
        if (format === 'es') return 'CanL3.esm.js';
        if (format === 'umd') return 'CanL3.umd.js';
        if (format === 'iife') return 'CanL3.iife.js';
        return `CanL3.${format}.js`;
      }
    },
    rollupOptions: {
      output: {
        exports: 'named',
        globals: {},
        // Ensure consistent chunk naming for caching
        chunkFileNames: '[name]-[hash].js',
        // Preserve export names for better debugging
        minifyInternalExports: false
      },
      // Enable aggressive tree-shaking
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
        unknownGlobalSideEffects: false
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true,
        // Enable dead code elimination
        dead_code: true,
        // Remove unused code
        unused: true,
        // Collapse simple variable assignments
        collapse_vars: true,
        // Reduce var declarations
        reduce_vars: true
      },
      mangle: {
        // Preserve function names for debugging
        keep_fnames: false,
        // Preserve class names for debugging
        keep_classnames: false
      },
      format: {
        // Remove comments except for licenses
        comments: /^\**!|@license|@preserve/i
      }
    },
    target: 'es2020',
    outDir: 'dist/browser',
    emptyOutDir: true,
    // Generate source maps for debugging
    sourcemap: true,
    // Report compressed sizes
    reportCompressedSize: true
  },
  resolve: {
    alias: {
      stream: 'stream-browserify'
    }
  }
});

