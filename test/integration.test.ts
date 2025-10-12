/**
 * Integration tests - End-to-end workflows
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { encodeCanL3, decodeCanL3, encodeSmart } from '../dist/index.js';
import { parseSchema, validateCanL3, generateTypeScript } from '../dist/schema/index.js';

describe('Integration - Complete workflow', () => {
  it('should handle encode â†’ validate â†’ decode workflow', () => {
    const schemaContent = `@schema v1

name: str required min:2
age: u32 required min:0
`;

    const data = { name: 'John', age: 30 };

    // Encode
    const CanL3 = encodeCanL3(data);

    // Decode
    const decoded = decodeCanL3(CanL3);

    // Validate
    const schema = parseSchema(schemaContent);
    const result = validateCanL3(decoded, schema);

    assert.strictEqual(result.valid, true);
    assert.strictEqual(decoded.name, 'John');
    assert.strictEqual(decoded.age, 30);
  });

  it('should generate types and validate data', () => {
    const schemaContent = `@schema v1

User: obj
  id: u32 required
  name: str required

user: User required
`;

    const schema = parseSchema(schemaContent);

    // Generate TypeScript
    const tsCode = generateTypeScript(schema);
    assert.ok(tsCode.includes('interface User'));
    assert.ok(tsCode.includes('id: number'));
    assert.ok(tsCode.includes('name: string'));

    // Validate data
    const validData = {
      user: { id: 1, name: 'Alice' }
    };
    const validResult = validateCanL3(validData, schema);
    assert.strictEqual(validResult.valid, true);

    // Invalid data
    const invalidData = {
      user: { id: 1 } // name missing
    };
    const invalidResult = validateCanL3(invalidData, schema);
    assert.strictEqual(invalidResult.valid, false);
  });

  it('should handle smart encoding with schema validation', () => {
    const schemaContent = `@schema v1

users: list<obj> required
`;

    const data = {
      users: [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
      ]
    };

    // Smart encode
    const CanL3 = encodeSmart(data);

    // Decode
    const decoded = decodeCanL3(CanL3);

    // Validate
    const schema = parseSchema(schemaContent);
    const result = validateCanL3(decoded, schema);

    assert.strictEqual(result.valid, true);
    assert.strictEqual(decoded.users.length, 2);
  });
});

describe('Integration - Edge cases', () => {
  it('should handle deeply nested validation', () => {
    const schemaContent = `@schema v1

Level1: obj
  value: str required

root: obj required
`;

    const schema = parseSchema(schemaContent);

    const data = {
      root: {
        nested: {
          deeply: {
            value: 'test'
          }
        }
      }
    };

    const CanL3 = encodeCanL3(data);
    const decoded = decodeCanL3(CanL3);

    assert.deepStrictEqual(decoded, data);
  });

  it('should preserve all data types in full round-trip', () => {
    const data = {
      string: 'hello',
      number: 42,
      float: 3.14,
      boolean: true,
      null: null,
      array: [1, 2, 3],
      object: { nested: 'value' },
      emptyArray: [],
      emptyObject: {}
    };

    const CanL3 = encodeCanL3(data);
    const decoded = decodeCanL3(CanL3);

    assert.strictEqual(decoded.string, 'hello');
    assert.strictEqual(decoded.number, 42);
    assert.strictEqual(decoded.float, 3.14);
    assert.strictEqual(decoded.boolean, true);
    assert.strictEqual(decoded.null, null);
    assert.deepStrictEqual(decoded.array, [1, 2, 3]);
    assert.deepStrictEqual(decoded.object, { nested: 'value' });
    assert.deepStrictEqual(decoded.emptyArray, []);
    assert.deepStrictEqual(decoded.emptyObject, {});
  });

  it('should handle all features together in complex scenario', () => {
    const schemaContent = `@schema v1

Product: obj
  id: u32 required
  name: str required min:3
  price: f64 required min:0 multipleOf:0.01
  tags: list<str> unique:true

products: list<Product> required min:1
total: u32 required
`;

    const data = {
      products: [
        { id: 1, name: 'Widget', price: 19.99, tags: ['new', 'sale'] },
        { id: 2, name: 'Gadget', price: 29.99, tags: ['featured'] }
      ],
      total: 2
    };

    // Full workflow
    const schema = parseSchema(schemaContent);
    const tsCode = generateTypeScript(schema);
    const CanL3 = encodeSmart(data);
    const decoded = decodeCanL3(CanL3);
    const validationResult = validateCanL3(decoded, schema);

    // Verify all steps
    assert.ok(tsCode.includes('interface Product'));
    assert.ok(CanL3.includes('products'));
    assert.strictEqual(decoded.products.length, 2);
    assert.strictEqual(validationResult.valid, true);
    assert.strictEqual(validationResult.errors.length, 0);
  });
});


