import test from 'node:test';
import assert from 'node:assert';
import { encodeCanL3, decodeCanL3 } from '../dist/index.js';

test('Bug: Object keys containing colons should be properly escaped', () => {
  const input = {
    "te:st": "test1"
  };

  const CanL3 = encodeCanL3(input);
  console.log('CanL3 output:', CanL3);

  const decoded = decodeCanL3(CanL3);
  console.log('Decoded:', JSON.stringify(decoded, null, 2));

  assert.deepStrictEqual(decoded, input, 'Keys with colons should round-trip correctly');
});

test('Bug: Multiline strings with newlines should handle triple quotes correctly', () => {
  const input = "test\ntest";

  const CanL3 = encodeCanL3(input);
  console.log('CanL3 output:', CanL3);

  const decoded = decodeCanL3(CanL3);
  console.log('Decoded:', JSON.stringify(decoded, null, 2));

  assert.strictEqual(decoded, input, 'Multiline strings should round-trip correctly');
});

test('Bug: Strings starting with double quotes should be handled correctly', () => {
  const input = {
    "users": [
      {
        "id": 1,
        "username": "alice_smith",
        "email": "\"alice@company.com",
        "firstName": "Alice",
        "lastName": "Smith",
        "age": 30,
        "role": "admin",
        "department": "Engineering",
        "verified": true,
        "lastLogin": "2025-11-04T10:30:00Z"
      },
      {
        "id": 2,
        "username": "bob_jones",
        "email": "bob@company.com",
        "firstName": "Bob",
        "lastName": "Jones",
        "age": 28,
        "role": "user",
        "department": "Marketing",
        "verified": true,
        "lastLogin": "2025-11-03T15:22:00Z"
      }
    ]
  };

  const CanL3 = encodeCanL3(input);
  console.log('CanL3 output:', CanL3);

  const decoded = decodeCanL3(CanL3);
  console.log('Decoded:', JSON.stringify(decoded, null, 2));

  assert.deepStrictEqual(decoded, input, 'Strings starting with quotes should round-trip correctly');
});


