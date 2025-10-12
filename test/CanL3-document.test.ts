/**
 * Comprehensive test suite for CanL3Document Class (T005)
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { CanL3Document } from '../dist/index.js';

describe('CanL3Document Class - T005', () => {
  const sampleCanL3 = `#version 1.0
user{name:str,age:u32,email:str}:
  name: Alice
  age: 30
  email: alice@example.com
users[2]{id:u32,name:str,role:str}:
  1, Bob, admin
  2, Carol, user`;

  const sampleData = {
    user: { name: 'Alice', age: 30, email: 'alice@example.com' },
    users: [
      { id: 1, name: 'Bob', role: 'admin' },
      { id: 2, name: 'Carol', role: 'user' }
    ]
  };

  // ========================================
  // Construction & Parsing
  // ========================================

  describe('Construction & Parsing', () => {
    test('should parse CanL3 string', () => {
      const doc = CanL3Document.parse(sampleCanL3);
      assert.ok(doc);
      assert.ok(doc instanceof CanL3Document);
    });

    test('should create from JSON', () => {
      const doc = CanL3Document.fromJSON(sampleData);
      assert.ok(doc);
      assert.ok(doc instanceof CanL3Document);
    });

    test('should handle empty object', () => {
      const doc = CanL3Document.fromJSON({});
      assert.ok(doc);
    });

    test('should handle array at root', () => {
      const doc = CanL3Document.fromJSON([1, 2, 3]);
      assert.ok(doc);
    });
  });

  // ========================================
  // Query Methods
  // ========================================

  describe('Query Methods', () => {
    test('should get simple property', () => {
      const doc = CanL3Document.fromJSON(sampleData);
      const result = doc.get('user.name');
      assert.strictEqual(result, 'Alice');
    });

    test('should get nested property', () => {
      const doc = CanL3Document.fromJSON(sampleData);
      const result = doc.get('user.age');
      assert.strictEqual(result, 30);
    });

    test('should get array element', () => {
      const doc = CanL3Document.fromJSON(sampleData);
      const result = doc.get('users[0]');
      assert.deepStrictEqual(result, { id: 1, name: 'Bob', role: 'admin' });
    });

    test('should get array element property', () => {
      const doc = CanL3Document.fromJSON(sampleData);
      const result = doc.get('users[0].name');
      assert.strictEqual(result, 'Bob');
    });

    test('should return undefined for non-existent path', () => {
      const doc = CanL3Document.fromJSON(sampleData);
      const result = doc.get('nonExistent');
      assert.strictEqual(result, undefined);
    });

    test('should query with wildcard', () => {
      const doc = CanL3Document.fromJSON(sampleData);
      const result = doc.query('users[*].name');
      assert.deepStrictEqual(result, ['Bob', 'Carol']);
    });

    test('should query with filter', () => {
      const doc = CanL3Document.fromJSON(sampleData);
      const result = doc.query('users[?(@.role == "admin")]');
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].name, 'Bob');
    });

    test('should check if path exists', () => {
      const doc = CanL3Document.fromJSON(sampleData);
      assert.strictEqual(doc.exists('user.name'), true);
      assert.strictEqual(doc.exists('user.nonExistent'), false);
    });

    test('should get type of value', () => {
      const doc = CanL3Document.fromJSON(sampleData);
      assert.strictEqual(doc.typeOf('user.name'), 'string');
      assert.strictEqual(doc.typeOf('user.age'), 'number');
      assert.strictEqual(doc.typeOf('users'), 'array');
    });

    test('should handle query errors gracefully', () => {
      const doc = CanL3Document.fromJSON(sampleData);
      assert.throws(() => doc.get('user[invalid]'));
    });
  });

  // ========================================
  // Navigation Methods
  // ========================================

  describe('Navigation Methods', () => {
    test('should iterate over entries', () => {
      const doc = CanL3Document.fromJSON(sampleData);
      const entries = Array.from(doc.entries());
      assert.strictEqual(entries.length, 2);
      assert.ok(entries.some(([k]) => k === 'user'));
    });

    test('should iterate over keys', () => {
      const doc = CanL3Document.fromJSON(sampleData);
      const keyList = Array.from(doc.keys());
      assert.deepStrictEqual(keyList.sort(), ['user', 'users']);
    });

    test('should iterate over values', () => {
      const doc = CanL3Document.fromJSON(sampleData);
      const valueList = Array.from(doc.values());
      assert.strictEqual(valueList.length, 2);
    });

    test('should iterate recursively with deepEntries', () => {
      const doc = CanL3Document.fromJSON(sampleData);
      const entries = Array.from(doc.deepEntries());
      assert.ok(entries.some(([p, v]) => p === 'user.name' && v === 'Alice'));
    });

    test('should iterate recursively with deepKeys', () => {
      const doc = CanL3Document.fromJSON(sampleData);
      const keyList = Array.from(doc.deepKeys());
      assert.ok(keyList.includes('user.name'));
      assert.ok(keyList.includes('users[0].id'));
    });

    test('should iterate recursively with deepValues', () => {
      const doc = CanL3Document.fromJSON(sampleData);
      const valueList = Array.from(doc.deepValues());
      assert.ok(valueList.includes('Alice'));
      assert.ok(valueList.includes(30));
    });

    test('should walk tree with callback', () => {
      const doc = CanL3Document.fromJSON(sampleData);
      const paths: string[] = [];
      doc.walk((path) => { paths.push(path); });
      assert.ok(paths.length > 0);
      assert.ok(paths.includes('user.name'));
    });

    test('should count nodes', () => {
      const doc = CanL3Document.fromJSON(sampleData);
      const count = doc.countNodes();
      assert.ok(count >= 8);
    });

    test('should find value', () => {
      const doc = CanL3Document.fromJSON(sampleData);
      const result = doc.find((v) => v === 'Alice');
      assert.strictEqual(result, 'Alice');
    });

    test('should find all matching values', () => {
      const doc = CanL3Document.fromJSON(sampleData);
      const result = doc.findAll((v) => typeof v === 'number');
      assert.ok(result.includes(30));
      assert.ok(result.includes(1));
    });

    test('should check if some value matches', () => {
      const doc = CanL3Document.fromJSON(sampleData);
      const result = doc.some((v) => v === 'Bob');
      assert.strictEqual(result, true);
    });

    test('should check if every value matches', () => {
      const doc = CanL3Document.fromJSON({ a: 1, b: 2, c: 3 });
      const result = doc.every((v) => typeof v === 'number');
      assert.strictEqual(result, true);
    });
  });

  // ========================================
  // Export Methods
  // ========================================

  describe('Export Methods', () => {
    test('should convert to JSON', () => {
      const doc = CanL3Document.fromJSON(sampleData);
      const json = doc.toJSON();
      assert.deepStrictEqual(json, sampleData);
    });

    test('should convert to CanL3', () => {
      const doc = CanL3Document.fromJSON(sampleData);
      const CanL3 = doc.toCanL3();
      assert.ok(CanL3.includes('#version'));
      assert.ok(CanL3.includes('user'));
    });

    test('should get size in bytes', () => {
      const doc = CanL3Document.fromJSON(sampleData);
      const size = doc.size();
      assert.ok(size > 0);
    });

    test('should get statistics', () => {
      const doc = CanL3Document.fromJSON(sampleData);
      const stats = doc.stats();
      assert.ok(stats.sizeBytes > 0);
      assert.ok(stats.nodeCount > 0);
      assert.ok(stats.maxDepth >= 1);
      assert.ok(stats.arrayCount >= 1);
      assert.ok(stats.objectCount >= 1);
      assert.ok(stats.primitiveCount > 0);
    });

    test('should get raw data', () => {
      const doc = CanL3Document.fromJSON(sampleData);
      const data = doc.getData();
      assert.deepStrictEqual(data, sampleData);
    });
  });

  // ========================================
  // Round-trip
  // ========================================

  describe('Round-trip', () => {
    test('should round-trip through CanL3', () => {
      const doc1 = CanL3Document.fromJSON(sampleData);
      const CanL3 = doc1.toCanL3();
      const doc2 = CanL3Document.parse(CanL3);
      const json = doc2.toJSON();
      assert.deepStrictEqual(json, sampleData);
    });

    test('should preserve data through query operations', () => {
      const doc = CanL3Document.fromJSON(sampleData);
      const name = doc.get('user.name');
      const age = doc.get('user.age');
      assert.strictEqual(name, 'Alice');
      assert.strictEqual(age, 30);
      // Original data unchanged
      assert.deepStrictEqual(doc.toJSON(), sampleData);
    });
  });
});


