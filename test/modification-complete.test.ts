/**
 * Complete Modification API test (T012-T013)
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { CanL3Document } from '../dist/index.js';

describe('Modification API Complete', () => {
  describe('Set & Delete', () => {
    test('should set and get value', () => {
      const doc = CanL3Document.fromJSON({ user: { name: 'Alice' } });
      doc.set('user.name', 'Bob');
      assert.strictEqual(doc.get('user.name'), 'Bob');
    });

    test('should delete property', () => {
      const doc = CanL3Document.fromJSON({ user: { name: 'Alice', age: 30 } });
      doc.delete('user.age');
      assert.strictEqual(doc.exists('user.age'), false);
      assert.strictEqual(doc.exists('user.name'), true);
    });

    test('should delete array element', () => {
      const doc = CanL3Document.fromJSON({ items: [1, 2, 3] });
      doc.delete('items[1]');
      assert.deepStrictEqual(doc.get('items'), [1, 3]);
    });
  });

  describe('Array Operations', () => {
    test('should push to array', () => {
      const doc = CanL3Document.fromJSON({ items: [1, 2] });
      const len = doc.push('items', 3, 4);
      assert.strictEqual(len, 4);
      assert.deepStrictEqual(doc.get('items'), [1, 2, 3, 4]);
    });

    test('should pop from array', () => {
      const doc = CanL3Document.fromJSON({ items: [1, 2, 3] });
      const val = doc.pop('items');
      assert.strictEqual(val, 3);
      assert.deepStrictEqual(doc.get('items'), [1, 2]);
    });
  });

  describe('Chaining', () => {
    test('should chain modifications', () => {
      const doc = CanL3Document.fromJSON({ a: 1, b: 2, items: [] });

      // Chain set operations (they return 'this')
      doc.set('a', 10)
         .set('b', 20);

      // push() returns number (array length), so call separately
      const len1 = doc.push('items', 'first');
      const len2 = doc.push('items', 'second');

      assert.strictEqual(doc.get('a'), 10);
      assert.strictEqual(doc.get('b'), 20);
      assert.strictEqual(doc.get('items').length, 2);
      assert.strictEqual(len1, 1);
      assert.strictEqual(len2, 2);
    });
  });
});

