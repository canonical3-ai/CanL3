/**
 * ESLint Plugin: CanL3-security
 *
 * Custom ESLint rules for CanL3 security patterns.
 * Catches security issues at development time.
 */

import noDirectPropertyAccess from './rules/no-direct-property-access.js';
import noUnsafeRegex from './rules/no-unsafe-regex.js';
import requireDepthLimit from './rules/require-depth-limit.js';

export default {
  meta: {
    name: 'eslint-plugin-CanL3-security',
    version: '1.0.0'
  },
  rules: {
    'no-direct-property-access': noDirectPropertyAccess,
    'no-unsafe-regex': noUnsafeRegex,
    'require-depth-limit': requireDepthLimit
  },
  configs: {
    recommended: {
      plugins: ['CanL3-security'],
      rules: {
        'CanL3-security/no-direct-property-access': 'warn',
        'CanL3-security/no-unsafe-regex': 'warn',
        'CanL3-security/require-depth-limit': 'warn'
      }
    },
    strict: {
      plugins: ['CanL3-security'],
      rules: {
        'CanL3-security/no-direct-property-access': 'error',
        'CanL3-security/no-unsafe-regex': 'error',
        'CanL3-security/require-depth-limit': 'error'
      }
    }
  }
};

