/**
 * Property-based tests for JSON <-> CanL3 roundtrips using fast-check
 */

import { test, describe } from "node:test";
import assert from "node:assert";
import fc from "fast-check";
import { encodeCanL3, decodeCanL3, encodeSmart } from "../dist/index.js";

// Generate a safe subset of JSON values that are known to roundtrip in CanL3:
// - primitives (null, boolean, finite numbers, safe strings)
// - flat objects with safe keys and primitive values
// - arrays of primitives (no nested arrays or objects)
const safeString = fc
    .string({ minLength: 1, maxLength: 64 })
    .filter((s) => /^[A-Za-z0-9 _.\-]*$/.test(s))
    .filter((s) => !/^\s|\s$/.test(s)) // no leading/trailing spaces
    .filter((s) => !/^-?(?:\d+|\d*\.\d+)(?:e[+-]?\d+)?$/i.test(s)); // avoid numeric-looking strings (including .5, -.5)

const primitiveArb = fc.oneof(
    fc.constant(null),
    fc.boolean(),
    fc.double({ noNaN: true, noDefaultInfinity: true, min: -1e12, max: 1e12 }),
    safeString
);

const forbiddenKeys = new Set([
    "__proto__",
    "constructor",
    "prototype",
    "toString",
    "valueOf",
    "hasOwnProperty",
    "isPrototypeOf",
    "propertyIsEnumerable",
    "__defineGetter__",
    "__defineSetter__",
    "__lookupGetter__",
    "__lookupSetter__"
]);

const safeKey = fc
    .string({ minLength: 1, maxLength: 24 })
    .filter((k) => /^[A-Za-z_][A-Za-z0-9_]*$/.test(k) && !k.startsWith("@") && !forbiddenKeys.has(k));

const objectOfPrimitives = fc.dictionary(safeKey, primitiveArb);
const arrayOfPrimitives = fc.array(primitiveArb, { maxLength: 64 });
const safeJson = fc.oneof(primitiveArb, objectOfPrimitives, arrayOfPrimitives);

describe("property-based: json <-> CanL3 roundtrip", () => {
    test("roundtrips any JSON value with default options", async () => {
        await fc.assert(
            fc.property(safeJson, (value) => {
                const CanL3 = encodeCanL3(value);
                const back = decodeCanL3(CanL3);
                assert.deepStrictEqual(back, value);
            }),
            { verbose: true, numRuns: 150 }
        );
    });

    test("roundtrips any JSON value across delimiters", async () => {
        const delimiterArb = fc.constantFrom(",", "|", ";", "\t");
        await fc.assert(
            fc.property(safeJson, delimiterArb, (value, delimiter) => {
                const CanL3 = encodeCanL3(value, {
                    delimiter,
                    includeTypes: false,
                    prettyDelimiters: false,
                    singleLinePrimitiveLists: true,
                    indent: 2
                });
                const back = decodeCanL3(CanL3);
                assert.deepStrictEqual(back, value);
            }),
            { verbose: true, numRuns: 150 }
        );
    });

    test("roundtrips any JSON value with encodeSmart", async () => {
        await fc.assert(
            fc.property(safeJson, (value) => {
                const CanL3 = encodeSmart(value);
                const back = decodeCanL3(CanL3);
                assert.deepStrictEqual(back, value);
            }),
            { verbose: true, numRuns: 150 }
        );
    });
});

