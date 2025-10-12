# CanL3 API Documentation v2.1.0

**Version:** 2.1.0
**Status:** Stable & Production Ready
**Last Updated:** 2025-11-18

This document provides detailed API documentation for the CanL3 TypeScript library.

## ðŸŽ‰ What's New in v2.1.0

- **Buffer Size Reporting**: Fixed accurate buffer size reporting in encode-stream overflow error messages
- **Test Suite Stability**: Resolved incorrect test expectations for buffer overflow scenarios
- **Enhanced Error Handling**: Improved error message accuracy for stream buffer overflow
- **887 Tests Passing**: Complete test coverage with 100% success rate
- **Zero Breaking Changes**: All existing code continues to work seamlessly
- **Zero Breaking Changes**: All existing functionality preserved
- **Production Ready**: Fully tested and stable release

## ðŸŽ‰ What's New in v2.0.9

- **Version Consistency Update**: Synchronized version numbers across all distribution channels
- **Documentation Alignment**: Updated version references throughout project documentation
- **Website Version Sync**: Aligned website with current version information
- **Zero Breaking Changes**: All existing code continues to work unchanged
- **Production Ready**: Release preparation with consistent versioning

## ðŸŽ‰ What's New in v2.0.6

- **Fixed Nested Array Round-Trip**: Perfect encode/decode for `[[]]`, `[[[]]]`, and complex nested arrays
- **Enhanced Parser Logic**: Improved handling of `[index][length]:` format in nested contexts
- **Zero Breaking Changes**: All existing code continues to work unchanged
- **Production Ready**: Critical data integrity fix for nested array usage

## ðŸŽ‰ What's New in v2.0.5

- **Dual-Mode System**: Choose between perfect round-trip (quoting) and clean output (preprocessing)
- **Enhanced CLI Support**: `--preprocess` flag for handling problematic JSON keys
- **Browser Preprocessing**: `preprocessJSON()` function for key transformation
- **Advanced Key Quoting**: Smart handling of `#`, `@`, spaces, and special characters

---

## Table of Contents

1. [CanL3Document API](#CanL3document-api) (Primary Interface)
2. [Core Functions](#core-functions) (Legacy/Lower-level)
3. [Utility Functions](#utility-functions)
4. [Dual-Mode System](#dual-mode-system-v204) â­ **NEW**
5. [Optimization API](#optimization-api-v200)
6. [Streaming API](#streaming-api-v075)
7. [Schema API](#schema-api-v080)
8. [Query API](#query-api-v060)
9. [Modification API](#modification-api-v065)
10. [Navigation API](#navigation-api-v060)
11. [Indexing API](#indexing-api-v070)
12. [File Operations](#file-operations)
13. [Error Handling](#error-handling)
14. [Performance](#performance-considerations)

---

## CanL3Document API

**CanL3Document** is the primary class for working with CanL3 data. It provides a high-level interface for querying, modifying, and navigating CanL3 documents.

### Static Factory Methods

#### `CanL3Document.parse(CanL3Text, options?)`

Parse a CanL3 string into a document.

```typescript
static parse(CanL3Text: string, options?: DecodeOptions): CanL3Document
```

**Example:**
```typescript
const doc = CanL3Document.parse(`
#version 1.0
users[2]{id,name}:
  1, Alice
  2, Bob
`);
```

---

#### `CanL3Document.fromJSON(data)`

Create a document from JavaScript data.

```typescript
static fromJSON(data: any): CanL3Document
```

**Example:**
```typescript
const doc = CanL3Document.fromJSON({
  users: [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ]
});
```

---

#### `CanL3Document.fromFile(path)`

Load a CanL3 document from a file (async).

```typescript
static async fromFile(path: string): Promise<CanL3Document>
```

**Example:**
```typescript
const doc = await CanL3Document.fromFile('data.CanL3');
```

---

#### `CanL3Document.fromFileSync(path)`

Load a CanL3 document from a file (sync).

```typescript
static fromFileSync(path: string): CanL3Document
```

**Example:**
```typescript
const doc = CanL3Document.fromFileSync('data.CanL3');
```

---

### Query Methods

#### `get(pathExpression)`

Get a value at a specific path.

```typescript
get(pathExpression: string): any
```

**Examples:**
```typescript
doc.get('user.name')           // 'Alice'
doc.get('users[0]')            // { id: 1, name: 'Alice' }
doc.get('users[-1]')           // Last user
```

---

#### `query(pathExpression)`

Query the document with advanced expressions.

```typescript
query(pathExpression: string): any
```

**Examples:**
```typescript
doc.query('users[*].name')                    // ['Alice', 'Bob']
doc.query('users[?(@.role == "admin")]')      // Filter users
doc.query('$..email')                         // All emails recursively
```

---

#### `exists(pathExpression)`

Check if a path exists.

```typescript
exists(pathExpression: string): boolean
```

---

#### `typeOf(pathExpression)`

Get the type of value at a path.

```typescript
typeOf(pathExpression: string): string | undefined
```

Returns: `'string' | 'number' | 'boolean' | 'null' | 'array' | 'object' | undefined`

---

### Modification Methods

#### `set(path, value)`

Set a value at a path (creates intermediate objects/arrays).

```typescript
set(path: string, value: any): CanL3Document
```

**Example:**
```typescript
doc
  .set('user.name', 'Alice')
  .set('user.age', 30)
  .set('user.verified', true);
```

---

#### `delete(path)`

Delete a value at a path.

```typescript
delete(path: string): CanL3Document
```

---

#### `push(path, ...items)`

Push items to an array.

```typescript
push(path: string, ...items: any[]): number
```

Returns: New array length

---

#### `pop(path)`

Remove and return the last item from an array.

```typescript
pop(path: string): any
```

---

#### `merge(path, object)`

Shallow merge an object at a path.

```typescript
merge(path: string, object: object): CanL3Document
```

---

### Navigation Methods

#### `entries()`

Iterate over [key, value] pairs at root level.

```typescript
*entries(): Generator<[string, any]>
```

**Example:**
```typescript
for (const [key, value] of doc.entries()) {
  console.log(`${key}: ${value}`);
}
```

---

#### `keys()` / `values()`

Iterate over keys or values at root level.

```typescript
*keys(): Generator<string>
*values(): Generator<any>
```

---

#### `deepEntries()` / `deepKeys()` / `deepValues()`

Recursively iterate over all [path, value] pairs, paths, or values.

```typescript
*deepEntries(): Generator<[string, any]>
*deepKeys(): Generator<string>
*deepValues(): Generator<any>
```

---

#### `walk(callback, options?)`

Walk the document tree with a callback.

```typescript
walk(callback: WalkCallback, options?: WalkOptions): void
```

**Example:**
```typescript
doc.walk((path, value, depth) => {
  console.log(`[Depth ${depth}] ${path}: ${value}`);
});
```

---

#### `find(predicate)` / `findAll(predicate)`

Find values matching a predicate.

```typescript
find(predicate: (value: any, path: string) => boolean): any
findAll(predicate: (value: any, path: string) => boolean): any[]
```

---

#### `some(predicate)` / `every(predicate)`

Check if any/all values match a predicate.

```typescript
some(predicate: (value: any, path: string) => boolean): boolean
every(predicate: (value: any, path: string) => boolean): boolean
```

---

#### `countNodes()`

Count total nodes in the document.

```typescript
countNodes(): number
```

---

### Change Tracking Methods

#### `snapshot()`

Create an independent copy of the document.

```typescript
snapshot(): CanL3Document
```

---

#### `diff(other)`

Compare with another document and generate a diff.

```typescript
diff(other: CanL3Document): DiffResult
```

**Returns:**
```typescript
interface DiffResult {
  changes: DiffEntry[];
  summary: {
    added: number;
    modified: number;
    deleted: number;
    total: number;
  };
}
```

---

#### `diffString(other)`

Generate a human-readable diff string.

```typescript
diffString(other: CanL3Document): string
```

---

### Indexing Methods

#### `createIndex(options)`

Create an index for fast lookups.

```typescript
createIndex(options: IndexOptions): void

interface IndexOptions {
  name: string;
  fields: string | string[];
  type?: 'hash' | 'btree' | 'compound';
  unique?: boolean;
}
```

**Example:**
```typescript
// Hash index (O(1) lookups)
doc.createIndex({
  name: 'userById',
  fields: 'id',
  type: 'hash',
  unique: true
});

// BTree index (O(log n) range queries)
doc.createIndex({
  name: 'userByAge',
  fields: 'age',
  type: 'btree'
});

// Compound index (multiple fields)
doc.createIndex({
  name: 'userByNameAndAge',
  fields: ['name', 'age'],
  type: 'compound'
});
```

---

#### `getIndex(name)`

Get an existing index.

```typescript
getIndex(name: string): IIndex | undefined
```

**Example:**
```typescript
const idx = doc.getIndex('userById');
const paths = idx.find(123);  // O(1) lookup
```

---

#### `listIndices()`

List all index names.

```typescript
listIndices(): string[]
```

---

#### `dropIndex(name)`

Remove an index.

```typescript
dropIndex(name: string): void
```

---

### Export Methods

#### `toJSON()`

Export to JavaScript object.

```typescript
toJSON(): any
```

---

#### `toCanL3(options?)`

Export to CanL3 string.

```typescript
toCanL3(options?: EncodeOptions): string
```

---

#### `save(path, options?)`

Save to file (async).

```typescript
async save(path: string, options?: EncodeOptions): Promise<void>
```

---

#### `saveSync(path, options?)`

Save to file (sync).

```typescript
saveSync(path: string, options?: EncodeOptions): void
```

---

### Metadata Methods

#### `stats()`

Get document statistics.

```typescript
stats(): DocumentStats

interface DocumentStats {
  sizeBytes: number;
  nodeCount: number;
  maxDepth: number;
  arrayCount: number;
  objectCount: number;
  primitiveCount: number;
}
```

---

## Core Functions

Lower-level encode/decode functions for direct use.

### `encodeCanL3(input, options?)`

Encodes JavaScript/TypeScript data to CanL3 format string.

```typescript
function encodeCanL3(input: any, options?: EncodeOptions): string

interface EncodeOptions {
  delimiter?: "," | "|" | "\t" | ";";    // Field delimiter (default: ",")
  includeTypes?: boolean;                // Add type hints (default: false)
  version?: string;                      // CanL3 version (default: "1.0")
  indent?: number;                       // Spaces per level (default: 2)
  singleLinePrimitiveLists?: boolean;    // Single line for primitives (default: true)
}
```

**Example:**
```typescript
import { encodeCanL3 } from 'CanL3';

const data = {
  users: [
    { id: 1, name: "Alice", active: true },
    { id: 2, name: "Bob", active: false }
  ]
};

const CanL3 = encodeCanL3(data, {
  delimiter: "|",
  includeTypes: true,
  indent: 4
});
```

---

### `decodeCanL3(text, options?)`

Decodes CanL3 format string back to JavaScript objects.

```typescript
function decodeCanL3(text: string, options?: DecodeOptions): any

interface DecodeOptions {
  delimiter?: "," | "|" | "\t" | ";";    // Field delimiter (auto-detected)
  strict?: boolean;                      // Strict mode validation (default: false)
}
```

**Example:**
```typescript
import { decodeCanL3 } from 'CanL3';

const CanL3Text = `#version 1.0
users[2]{id:u32,name:str,active:bool}:
  1, Alice, true
  2, Bob, false`;

const data = decodeCanL3(CanL3Text);
// { users: [{ id: 1, name: "Alice", active: true }, ...] }
```

---

### `encodeSmart(input, options?)`

Automatically chooses optimal encoding settings based on data analysis.

```typescript
function encodeSmart(input: any, options?: EncodeOptions): string
```

**Smart Optimization:**
1. Delimiter selection to minimize quoting
2. Layout optimization for compactness
3. Type hint optimization

**Example:**
```typescript
import { encodeSmart } from 'CanL3';

const data = {
  items: [
    { name: "Item A", category: "Tools, Hardware" },
    { name: "Item B", category: "Electronics" }
  ]
};

// Smart encoding will use "|" delimiter to avoid quoting commas
const optimized = encodeSmart(data);
```

---

## Dual-Mode System v2.0.6 â­ **UPDATED**

The dual-mode system provides two approaches for handling problematic JSON keys:

### Mode 1: Default (Quoting Only)
- **Perfect Round-trip**: Data integrity guaranteed
- **Smart Quoting**: Automatically quotes problematic keys
- **Special Characters**: Handles `#`, `@`, spaces, empty keys, etc.

### Mode 2: Preprocessing (Key Transformation)
- **Clean Output**: Transforms problematic keys to safe identifiers
- **Enhanced Readability**: Better for LLM prompts and data analysis
- **Automatic Mapping**: Handles key transformation transparently

### Browser Preprocessing Function

#### `preprocessJSON(input, options?)`

Preprocess JSON data to clean up problematic keys.

```typescript
function preprocessJSON(
  input: string | object,
  options?: PreprocessOptions
): string | object

interface PreprocessOptions {
  renameEmptyKeys?: boolean;    // Rename empty string keys (default: true)
  renameSpecialChars?: boolean; // Rename keys with special chars (default: true)
  renameSpaces?: boolean;       // Rename keys with spaces (default: true)
  renameReserved?: boolean;     // Rename reserved keywords (default: true)
}
```

**Examples:**

```typescript
import { preprocessJSON, encodeCanL3 } from 'CanL3/browser';

const problematicJSON = `{
  "#": "hash-key",
  "": "empty-key",
  "key with spaces": "spaced-key",
  "@type": "at-symbol-key"
}`;

// Preprocess for clean CanL3 output
const preprocessed = preprocessJSON(problematicJSON);
console.log(preprocessed);
// {
//   "comment": "hash-key",
//   "empty": "empty-key",
//   "key_with_spaces": "spaced-key",
//   "type": "at-symbol-key"
// }

// Encode to clean CanL3
const CanL3 = encodeCanL3(JSON.parse(preprocessed));
console.log(CanL3);
// comment[1]:
//   "hash-key"
// empty[1]:
//   "empty-key"
// key_with_spaces[1]:
//   spaced-key
// type[1]:
//   "at-symbol-key"
```

### Node.js Key Transformation

#### `transformObjectKeys(obj, transformer)`

Transform object keys using a custom function.

```typescript
function transformObjectKeys(
  obj: any,
  transformer: (key: string, path: string) => string
): any
```

**Example:**

```typescript
import { transformObjectKeys } from 'CanL3';

const data = {
  "#": "hash-value",
  "": "empty-value",
  "user name": "Alice"
};

// Custom transformation
const transformed = transformObjectKeys(data, (key, path) => {
  if (key === '#') return 'comment';
  if (key === '') return 'empty';
  if (key.includes(' ')) return key.replace(/ /g, '_');
  return key;
});

console.log(transformed);
// {
//   "comment": "hash-value",
//   "empty": "empty-value",
//   "user_name": "Alice"
// }
```

### CLI Integration

The CLI automatically supports preprocessing through the `--preprocess` flag:

```bash
# Default mode (perfect round-trip)
CanL3 encode messy-data.json

# Preprocessing mode (clean output)
CanL3 encode messy-data.json --preprocess
```

### When to Use Each Mode

**Default Mode (Quoting)**
- Configuration files
- API responses
- Database exports
- When exact round-trip is critical
- Production data pipelines

**Preprocessing Mode**
- Data analysis and exploration
- LLM prompts and training data
- Temporary files and scripts
- When readability is priority
- Development and debugging

### Advanced Key Quoting

The encoding system automatically detects and quotes problematic keys:

```typescript
import { encodeCanL3 } from 'CanL3';

const data = {
  "": "empty-key",
  "#": "hash-key",
  "@type": "at-key",
  "key with spaces": "spaced-key",
  "key:with:colons": "colon-key",
  "key{braces}": "brace-key"
};

const CanL3 = encodeCanL3(data);
console.log(CanL3);
// ""[1]:
//   "empty-key"
// "#"[1]:
//   "hash-key"
// "@type"[1]:
//   "at-key"
// "key with spaces"[1]:
//   "spaced-key"
// "key:with:colons"[1]:
//   "colon-key"
// "key{braces}"[1]:
//   "brace-key"
```

**Characters That Trigger Quoting:**
- Empty strings `""`
- Hash `#`
- At symbol `@`
- Colon `:`
- Comma `,`
- Braces `{}`
- Quotes `"`
- Leading/trailing spaces
- Tab characters
- Newline characters

---

## Utility Functions

### `parseCanL3Line(line, delimiter)`

Parses a single CanL3 line into array of field values.

```typescript
function parseCanL3Line(line: string, delimiter: CanL3Delimiter): string[]
```

---

### `inferPrimitiveType(value)`

Infers the primitive type of a value for type hint generation.

```typescript
function inferPrimitiveType(value: unknown): CanL3TypeHint

type CanL3TypeHint = "u32" | "i32" | "f64" | "bool" | "null" | "str" | "obj" | "list"
```

**Examples:**
```typescript
inferPrimitiveType(42);        // "u32"
inferPrimitiveType(-10);       // "i32"
inferPrimitiveType(3.14);      // "f64"
inferPrimitiveType(true);      // "bool"
inferPrimitiveType(null);      // "null"
inferPrimitiveType("hello");   // "str"
inferPrimitiveType([1,2,3]);   // "list"
inferPrimitiveType({a: 1});    // "obj"
```

---

### `isUniformObjectArray(arr)`

Check if an array contains uniform objects.

```typescript
function isUniformObjectArray(arr: any[]): boolean
```

---

### `getUniformColumns(arr)`

Get stable column order for uniform object array.

```typescript
function getUniformColumns(arr: any[]): string[]
```

---

## Streaming API (v0.7.5+)

For handling large datasets efficiently.

### `streamQuery(filePath, pathExpression, options?)`

Stream query results from a file.

```typescript
async function* streamQuery(
  filePath: string,
  pathExpression: string,
  options?: StreamQueryOptions
): AsyncGenerator<any>

interface StreamQueryOptions {
  filter?: (value: any) => boolean;
  limit?: number;
  skip?: number;
  highWaterMark?: number;
}
```

**Example:**
```typescript
import { streamQuery } from 'CanL3';

// Process 10GB file with constant memory
for await (const record of streamQuery('huge-data.CanL3', 'records[*]', {
  filter: r => r.active,
  limit: 1000
})) {
  process(record);
}
```

---

### `streamAggregate(filePath, pathExpression, reducer, initialValue)`

Aggregate data from a stream.

```typescript
async function streamAggregate<T, R>(
  filePath: string,
  pathExpression: string,
  reducer: (accumulator: R, value: T) => R,
  initialValue: R
): Promise<R>
```

**Example:**
```typescript
const total = await streamAggregate(
  'sales.CanL3',
  'sales[*].amount',
  (sum, amount) => sum + amount,
  0
);
```

---

### `StreamPipeline`

Chainable stream transformations.

```typescript
import { StreamPipeline } from 'CanL3';

const pipeline = new StreamPipeline('data.CanL3')
  .filter(item => item.active)
  .map(item => ({ ...item, processed: true }))
  .limit(100);

for await (const item of pipeline) {
  console.log(item);
}
```

---

## Schema API (v0.8.0+)

For data validation and type generation.

### `parseSchema(schemaText)`

Parse CanL3 Schema Language (TSL) into schema object.

```typescript
function parseSchema(schemaText: string): CanL3Schema
```

**Example:**
```typescript
import { parseSchema } from 'CanL3/schema';

const schemaText = `
@schema v1
User: obj
  id: u32 required
  name: str required min:2 max:100
  email: str required pattern:email
`;

const schema = parseSchema(schemaText);
```

---

### `validateCanL3(data, schema, options?)`

Validate data against a schema.

```typescript
function validateCanL3(
  data: any,
  schema: CanL3Schema,
  options?: { strict?: boolean }
): ValidationResult

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}
```

**Example:**
```typescript
import { parseSchema, validateCanL3 } from 'CanL3/schema';

const schema = parseSchema(schemaText);
const data = { id: 123, name: 'Alice', email: 'alice@example.com' };

const result = validateCanL3(data, schema);
if (!result.valid) {
  result.errors.forEach(err => console.error(err.message));
}
```

---

### `generateTypeScript(schema, options?)`

Generate TypeScript type definitions from schema.

```typescript
function generateTypeScript(
  schema: CanL3Schema,
  options?: GenerateOptions
): string

interface GenerateOptions {
  exportAll?: boolean;
  readonly?: boolean;
  strict?: boolean;
}
```

---

## Query API (v0.6.0+)

See [QUERY_API.md](./QUERY_API.md) for detailed query syntax and examples.

**Path Syntax:**
- Property access: `user.name`
- Array indexing: `users[0]`, `users[-1]`
- Wildcards: `users[*].name`, `data.*`
- Recursive descent: `$..email`
- Array slicing: `users[0:5]`, `users[::2]`
- Filters: `users[?(@.age > 18)]`

**Operators:**
- Comparison: `==`, `!=`, `>`, `<`, `>=`, `<=`
- Logical: `&&`, `||`, `!`
- String: `contains`, `startsWith`, `endsWith`, `matches`

---

## Modification API (v0.6.5+)

See [MODIFICATION_API.md](./MODIFICATION_API.md) for detailed modification examples.

**Operations:**
- `set(path, value)` - Create/update values
- `delete(path)` - Remove values
- `push(path, ...items)` - Add to arrays
- `pop(path)` - Remove from arrays
- `merge(path, object)` - Merge objects

**Change Tracking:**
- `snapshot()` - Create backups
- `diff(other)` - Generate diffs
- `diffString(other)` - Human-readable diffs

---

## Navigation API (v0.6.0+)

See [NAVIGATION_API.md](./NAVIGATION_API.md) for detailed navigation examples.

**Iterators:**
- `entries()`, `keys()`, `values()` - Root level
- `deepEntries()`, `deepKeys()`, `deepValues()` - Recursive
- `walk(callback, options?)` - Tree walking

**Search:**
- `find(predicate)` - First match
- `findAll(predicate)` - All matches
- `some(predicate)`, `every(predicate)` - Predicates

---

## Indexing API (v0.7.0+)

**Index Types:**
- **Hash Index**: O(1) exact matches
- **BTree Index**: O(log n) range queries
- **Compound Index**: Multi-field indexing

**Operations:**
- `createIndex(options)` - Create index
- `getIndex(name)` - Retrieve index
- `listIndices()` - List all indices
- `dropIndex(name)` - Remove index

---

## File Operations

### FileEditor

Atomic file editing with automatic backups.

```typescript
import { FileEditor } from 'CanL3';

// Open file (creates backup)
const editor = await FileEditor.open('config.CanL3', {
  backup: true,
  backupSuffix: '.bak'
});

// Modify data
editor.data.app.version = '2.0.0';

// Check if modified
if (editor.isModified()) {
  // Save atomically (temp file + rename)
  await editor.save();
}

// Restore from backup if needed
await editor.restoreBackup();
```

---

## Error Handling

### Error Classes

**CanL3Error** - Base error class
```typescript
class CanL3Error extends Error {
  line?: number;
  column?: number;
  source?: string;
}
```

**CanL3ParseError** - Syntax errors
```typescript
class CanL3ParseError extends CanL3Error {
  suggestion?: string;
}
```

**CanL3ValidationError** - Schema validation errors
```typescript
class CanL3ValidationError extends CanL3Error {
  field: string;
  expected?: string;
  actual?: string;
}
```

**CanL3TypeError** - Type mismatch errors
```typescript
class CanL3TypeError extends CanL3Error {
  expected: string;
  actual: string;
}
```

### Example

```typescript
try {
  const doc = CanL3Document.parse('invalid syntax');
} catch (error) {
  if (error instanceof CanL3ParseError) {
    console.error(`Parse error at line ${error.line}: ${error.message}`);
    if (error.suggestion) {
      console.log(`Suggestion: ${error.suggestion}`);
    }
  }
}
```

---

## Performance Considerations

### Encoding Performance
- Linear time O(n) where n = data size
- Memory efficient with array joins
- Type inference is cached

### Decoding Performance
- Single-pass parsing
- Efficient state machine
- Lazy type coercion

### Query Performance
- Simple path access: <0.1ms
- Wildcard queries (1000 nodes): <20ms
- Filter queries (1000 nodes): <50ms
- With indices: O(1) for hash, O(log n) for btree

### Optimization Tips
1. Use `encodeSmart()` for automatic optimization
2. Create indices for repeated lookups
3. Use streaming for large files (>100MB)
4. Enable strict mode only when needed
5. Batch modifications before saving

---

## TypeScript Integration

### Type Safety

```typescript
interface User {
  id: number;
  name: string;
  role: string;
}

const doc = CanL3Document.fromJSON({
  users: [] as User[]
});

// Type-safe queries (with assertion)
const users = doc.query('users[*]') as User[];
```

### Generic Helpers

```typescript
function loadTyped<T>(filePath: string): T {
  const doc = CanL3Document.fromFileSync(filePath);
  return doc.toJSON() as T;
}

// Usage
interface Config {
  database: {
    host: string;
    port: number;
  };
}

const config = loadTyped<Config>('config.CanL3');
```

---

## Browser Compatibility

CanL3 works in all modern browsers and Node.js environments.

### ES Module

```html
<script type="module">
  import { CanL3Document, encodeCanL3, decodeCanL3 } from 'https://cdn.skypack.dev/CanL3';

  const doc = CanL3Document.fromJSON({ hello: 'world' });
  const CanL3 = doc.toCanL3();
</script>
```

### CommonJS (Node.js)

```javascript
const { CanL3Document, encodeCanL3, decodeCanL3 } = require('CanL3');
```

### Bundle Size

- **Core**: 8.84 KB gzipped
- **Full**: ~25 KB gzipped (with all features)
- **Tree-shakeable**: Import only what you need

---

## Optimization API v2.0.0 â­ **NEW**

The Optimization API provides advanced token and byte compression strategies for CanL3 documents. This is the most powerful feature in v2.0.0, offering up to 60% additional savings beyond standard CanL3 compression.

### Overview

The optimization system includes 10 different strategies that can be applied individually or automatically:

1. **Dictionary Encoding** - Compress repetitive values
2. **Column Reordering** - Optimize field order for compression
3. **Numeric Quantization** - Reduce decimal precision safely
4. **Delta Encoding** - Compress sequential numeric data
5. **Run-Length Encoding (RLE)** - Compress repeated patterns
6. **Bit Packing** - Optimized binary encoding for booleans/flags
7. **Schema Inheritance** - Reuse type definitions
8. **Hierarchical Grouping** - Structure-based optimization
9. **Tokenizer Awareness** - LLM-specific optimization
10. **Adaptive Optimization** - Multi-strategy automatic optimization

### AdaptiveOptimizer (Recommended)

The `AdaptiveOptimizer` automatically analyzes your data and selects the best combination of optimization strategies.

```typescript
import { AdaptiveOptimizer } from 'CanL3';

const optimizer = new AdaptiveOptimizer();
const data = [
  { id: 1, name: "Alice", department: "Engineering", salary: 75000 },
  { id: 2, name: "Bob", department: "Engineering", salary: 80000 },
  { id: 3, name: "Carol", department: "Marketing", salary: 65000 }
];

// Analyze data for optimization opportunities
const analysis = optimizer.analyzeDataset(data);
console.log('Recommended strategies:', analysis.recommendedStrategies);
console.log('Estimated savings:', analysis.estimatedSavings + '%');

// Apply automatic optimization
const result = optimizer.optimize(data);
console.log('Optimized data:', result.optimizedData);
console.log('Directives:', result.directives);

// Example output:
// Directives: [
//   '@dict department: {0:Engineering,1:Marketing}',
//   '@delta salary',
//   '@map name: {A:Alice,B:Bob,C:Carol}'
// ]
```

### Individual Optimizers

#### DictionaryBuilder

Compress repetitive values by creating lookup dictionaries:

```typescript
import { DictionaryBuilder } from 'CanL3';

const dictBuilder = new DictionaryBuilder();
const values = ["Engineering", "Marketing", "Engineering", "Sales"];

const dictionary = dictBuilder.analyzeDictionaryCandidates(values, 'department');
if (dictionary) {
  console.log('Savings:', dictionary.totalSavings, 'bytes');
  console.log('Encoding strategy:', dictionary.encoding);

  // Generate CanL3 directive
  const directive = dictBuilder.generateDictionaryDirective(dictionary);
  console.log('Directive:', directive); // @dict department: {0:Engineering,1:Marketing,2:Sales}

  // Encode values
  const encoded = dictBuilder.encodeWithDictionary(values, dictionary);
  console.log('Encoded:', encoded); // [0, 1, 0, 2]
}
```

#### DeltaEncoder

Compress sequential numeric data using delta encoding:

```typescript
import { DeltaEncoder } from 'CanL3';

const delta = new DeltaEncoder();
const timestamps = [1704067200000, 1704067201000, 1704067202000];

// Analyze sequence
const analysis = delta.analyzeSequence(timestamps);
console.log('Recommended:', analysis.recommended);
console.log('Compression ratio:', analysis.compressionRatio);

// Encode sequence
const encoded = delta.encode(timestamps, 'timestamp');
console.log('Delta encoded:', encoded); // [1704067200000, 1000, 1000]

// Generate directive
const directive = delta.generateDirective('timestamp');
console.log('Directive:', directive); // @delta timestamp
```

#### BitPacker

Compress boolean values and small integers using bit packing:

```typescript
import { BitPacker } from 'CanL3';

const packer = new BitPacker();
const flags = [true, false, true, true, false];

// Analyze packing potential
const analysis = packer.analyzeBitPacking(flags);
console.log('Recommended:', analysis.recommended);
console.log('Bit savings:', analysis.bitSavings);

// Pack values
const packed = packer.packBooleans(flags);
console.log('Packed:', packed); // Bit-packed binary representation

// Generate directive
const directive = packer.generateDirective('flags');
console.log('Directive:', directive); // @bitpack flags:bool
```

#### RunLengthEncoder (RLE)

Compress repeated consecutive values:

```typescript
import { RunLengthEncoder } from 'CanL3';

const rle = new RunLengthEncoder();
const values = ["A", "A", "A", "B", "B", "C"];

// Analyze RLE potential
const analysis = rle.analyzeSequence(values);
console.log('Recommended:', analysis.recommended);
console.log('Compression ratio:', analysis.compressionRatio);

// Encode sequence
const encoded = rle.encode(values);
console.log('RLE encoded:', encoded); // [{value: "A", count: 3}, {value: "B", count: 2}, {value: "C", count: 1}]
```

#### ColumnReorderer

Optimize column order for better compression:

```typescript
import { ColumnReorderer } from 'CanL3';

const reorderer = new ColumnReorderer();
const data = [
  { name: "Alice", id: 1, department: "Engineering" },
  { name: "Bob", id: 2, department: "Engineering" }
];

// Analyze reordering potential
const shouldReorder = reorderer.shouldReorder(data, ['name', 'id', 'department']);
if (shouldReorder) {
  const result = reorderer.reorderColumns(data, ['name', 'id', 'department']);
  console.log('New column order:', result.reorderedColumns);
  console.log('Mapping:', result.mapping);

  // Generate directive
  const directive = reorderer.generateMappingDirective(result.mapping);
  console.log('Directive:', directive); // @map {0:id,1:name,2:department}
}
```

### Integration with CanL3Document

Optimization integrates seamlessly with CanL3Document:

```typescript
import { CanL3Document, AdaptiveOptimizer } from 'CanL3';

const doc = CanL3Document.fromJSON({
  users: [
    { id: 1, name: "Alice", role: "admin", active: true },
    { id: 2, name: "Bob", role: "user", active: false }
  ]
});

// Optimize the document
const optimizer = new AdaptiveOptimizer();
const userData = doc.get('users');
const optimization = optimizer.optimize(userData);

// Create new document with optimizations
const optimizedDoc = CanL3Document.fromJSON({
  users: optimization.optimizedData
});

// Export with optimization directives
const CanL3WithOptimizations = optimizedDoc.toCanL3();
console.log(CanL3WithOptimizations);

// Output includes directives like:
// @dict role: {0:admin,1:user}
// @bitpack active:bool
```

### Performance Impact

- **Additional Savings**: 15-60% beyond standard CanL3 compression
- **Processing Time**: O(n) linear time, typically <10ms for 10K records
- **Memory Usage**: Minimal overhead, optimized for streaming
- **Decoding**: Full round-trip compatibility with all optimizers

### Best Practices

1. **Use AdaptiveOptimizer** for automatic optimization selection
2. **Apply to large datasets** (>100 records) for maximum benefit
3. **Combine with Smart Encoding** for best results
4. **Profile your data** first to identify optimization opportunities
5. **Consider decode cost** vs compression benefit for real-time applications

---

## Version

**Current version: 2.1.0**

- âœ… Production ready and stable
- âœ… Full feature set (query, modify, index, stream, schema, optimize)
- âœ… 100% test coverage (791+ tests)
- âœ… Zero runtime dependencies
- âœ… TypeScript-first with full type safety
- âœ… Browser and Node.js support
- ðŸ†• Advanced optimization system with 10 strategies
- ðŸ†• Dual-mode system for handling problematic JSON keys
- ðŸ†• Enhanced CLI with preprocessing support
- ðŸ†• Advanced key quoting for special characters

---

## See Also

- [Getting Started Guide](./GETTING_STARTED.md)
- [CLI Documentation](./CLI.md)
- [Query API Reference](./QUERY_API.md)
- [Modification API Guide](./MODIFICATION_API.md)
- [Navigation API Reference](./NAVIGATION_API.md)
- [Format Specification](./SPECIFICATION.md)
- [Schema Specification](./SCHEMA_SPECIFICATION.md)
- [Use Cases](./USE_CASES.md)

---

**Happy coding with CanL3! ðŸš€**


