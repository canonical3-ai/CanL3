/**
 * Security Integration Test
 * Tests that security improvements don't break existing functionality
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';

describe('Security Integration', () => {
  test('should not break basic encode/decode functionality', async (t) => {
    const { encodeCanL3, decodeCanL3 } = await import('../../dist/index.js');

    const testData = {
      name: 'test',
      value: 42,
      active: true,
      tags: ['tag1', 'tag2']
    };

    const encoded = encodeCanL3(testData);
    const decoded = decodeCanL3(encoded);

    assert.deepStrictEqual(decoded, testData);
  });

  test('should not break CanL3Document functionality', async (t) => {
    const { CanL3Document } = await import('../../dist/index.js');

    const doc = CanL3Document.fromJSON({ users: [{ id: 1, name: 'Alice' }] });

    // Basic functionality should work
    assert.strictEqual(doc.get('users[0].name'), 'Alice');
    assert.ok(doc.query('users[?(@.id == 1)]'));
  });

  test('should handle complex nested structures', async (t) => {
    const { encodeCanL3, decodeCanL3 } = await import('../../dist/index.js');

    const complexData = {
      level1: {
        level2: {
          level3: {
            deep: 'value',
            array: [1, 2, 3, { nested: true }]
          }
        }
      }
    };

    const encoded = encodeCanL3(complexData);
    const decoded = decodeCanL3(encoded);

    assert.deepStrictEqual(decoded, complexData);
  });

  test('should maintain performance characteristics', async (t) => {
    const { encodeCanL3, decodeCanL3 } = await import('../../dist/index.js');

    // Create moderately complex test data
    const testData = {
      users: Array.from({ length: 100 }, (_, i) => ({
        id: i,
        name: `User ${i}`,
        active: i % 2 === 0,
        metadata: {
          created: new Date().toISOString(),
          tags: [`tag${i}`, `category${i % 5}`]
        }
      }))
    };

    const start = Date.now();
    const encoded = encodeCanL3(testData);
    const decoded = decodeCanL3(encoded);
    const duration = Date.now() - start;

    // Should complete within reasonable time (1 second for 100 users)
    assert.ok(duration < 1000, `Encoding/decoding took ${duration}ms, expected < 1000ms`);
    assert.deepStrictEqual(decoded, testData);
  });

  test('should handle special characters safely', async (t) => {
    const { encodeCanL3, decodeCanL3 } = await import('../../dist/index.js');

    const specialData = {
      'special:chars': 'test:value',
      'quotes"inside': 'text with "quotes"',
      'newlines\ninside': 'text with\nnewlines',
      'unicode\u00e9': 'cafÃ©',
      'math:Ï€': 3.14159
    };

    const encoded = encodeCanL3(specialData);
    const decoded = decodeCanL3(encoded);

    assert.deepStrictEqual(decoded, specialData);
  });
});
