/**
 * Test for parser/value-parser.ts:25 bug
 * Bug: arrayLength || fallback causes issues when arrayLength is 0
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { encodeCanL3, decodeCanL3 } from '../dist/index.js';

describe('Zero-Length Array Bug Test', () => {
  it('should handle zero-length array correctly', () => {
    const data = { emptyArray: [] };

    // Encode to CanL3
    const CanL3 = encodeCanL3(data);
    console.log('Encoded CanL3:', CanL3);

    // Decode back
    const decoded = decodeCanL3(CanL3);
    console.log('Decoded:', decoded);

    assert.deepStrictEqual(decoded.emptyArray, [], 'Empty array should remain empty');
  });

  it('should handle zero-length object array correctly', () => {
    const data = { users: [] };

    const CanL3 = encodeCanL3(data, { includeTypes: true });
    console.log('Encoded CanL3 with types:', CanL3);

    const decoded = decodeCanL3(CanL3);
    console.log('Decoded:', decoded);

    assert.deepStrictEqual(decoded.users, [], 'Empty object array should remain empty');
  });

  it('should test the specific bug scenario - single-line array with length 0', () => {
    // Manually craft CanL3 with arrayLength=0 but with field data (edge case)
    const CanL3WithBug = `#version 1.0
items[0]{id,name}: `;

    const decoded = decodeCanL3(CanL3WithBug);
    console.log('Decoded from manual CanL3:', decoded);

    // Should be empty array, not try to parse non-existent fields
    assert.ok(Array.isArray(decoded.items), 'Should be an array');
    assert.strictEqual(decoded.items.length, 0, 'Should be empty array');
  });
});


