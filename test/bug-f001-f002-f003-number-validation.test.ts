/**
 * BUG-F001, F002, F003: Number Validation Tests
 *
 * SEVERITY: MEDIUM
 * CATEGORY: Functional Bug - Input Validation
 *
 * DESCRIPTION:
 * parseInt and parseFloat are used without validating results.
 * Invalid numbers could produce NaN or Infinity, causing unexpected behavior.
 *
 * FILES:
 * - BUG-F001: src/parser/content-parser.ts:78, src/parser/block-parser.ts:152
 * - BUG-F002: src/parser/line-parser.ts:60-73
 * - BUG-F003: src/query/tokenizer.ts:137
 */

import { test } from 'node:test';
import assert from 'node:assert';
import { decodeCanL3 } from '../dist/index.js';
import { CanL3Document } from '../dist/document.js';
import { CanL3ParseError } from '../dist/errors/index.js';

// BUG-F001: Array length validation
test('BUG-F001: Invalid array length should throw error', () => {
  const invalidCanL3 = 'items[abc]: 1, 2, 3';

  assert.throws(
    () => decodeCanL3(invalidCanL3),
    (err: any) => err instanceof CanL3ParseError && err.message.includes('array length'),
    'Should reject invalid array length'
  );
});

test('BUG-F001: Negative array length should throw error', () => {
  const invalidCanL3 = 'items[-5]: 1, 2, 3';

  assert.throws(
    () => decodeCanL3(invalidCanL3),
    CanL3ParseError,
    'Should reject negative array length'
  );
});

test('BUG-F001: Valid array length should work', () => {
  const validCanL3 = 'items[3]: 1, 2, 3';
  const result = decodeCanL3(validCanL3);

  assert.deepStrictEqual(result, { items: [1, 2, 3] });
});

// BUG-F002: Number parsing validation
test('BUG-F002: Extremely large integer should be handled safely', () => {
  // Numbers beyond MAX_SAFE_INTEGER
  const largeCanL3 = `value: ${Number.MAX_SAFE_INTEGER + 1000}`;

  // BUG-007 FIX: Should be preserved as string to prevent precision loss
  const result = decodeCanL3(largeCanL3);
  assert.ok(typeof result.value === 'string', 'Large integers should be preserved as strings');
  assert.ok(result.value === String(Number.MAX_SAFE_INTEGER + 1000), 'Value should match original');
});

test('BUG-F002: Valid numbers parse correctly', () => {
  const CanL3 = `
int: 42
negative: -100
float: 3.14
zero: 0
`;

  const result = decodeCanL3(CanL3.trim());
  assert.strictEqual(result.int, 42);
  assert.strictEqual(result.negative, -100);
  assert.strictEqual(result.float, 3.14);
  assert.strictEqual(result.zero, 0);
});

// BUG-F003: Query tokenizer number validation
test('BUG-F003: Query with extremely large number should handle safely', () => {
  const doc = CanL3Document.fromJSON({
    items: [
      { id: 1, value: 100 },
      { id: 2, value: 200 }
    ]
  });

  // Query with very large number
  const result = doc.query(`items[?(@.value < ${Number.MAX_VALUE})]`);
  assert.strictEqual(result.length, 2, 'Should handle large numbers in queries');
});

test('BUG-F003: Query with normal numbers works correctly', () => {
  const doc = CanL3Document.fromJSON({
    items: [
      { id: 1, score: 85 },
      { id: 2, score: 92 },
      { id: 3, score: 78 }
    ]
  });

  const result = doc.query('items[?(@.score > 80)]');
  assert.strictEqual(result.length, 2);
  assert.deepStrictEqual(result.map((r: any) => r.id), [1, 2]);
});

// Edge cases
test('Number validation: Zero is valid', () => {
  const CanL3 = 'count: 0';
  const result = decodeCanL3(CanL3);
  assert.strictEqual(result.count, 0);
});

test('Number validation: Negative zero is handled', () => {
  const CanL3 = 'value: -0';
  const result = decodeCanL3(CanL3);
  assert.ok(Object.is(result.value, -0) || result.value === 0);
});


