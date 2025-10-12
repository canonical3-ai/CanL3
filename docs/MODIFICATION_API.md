# CanL3 Modification API Guide v2.0.6

**Version:** 2.0.6
**Status:** Stable & Production Ready
**Last Updated:** 2025-11-16

Complete guide to modifying CanL3 documents with the Modification API.

---

## ðŸ“‹ Table of Contents

1. [Basic Operations](#basic-operations)
2. [Path Creation](#path-creation)
3. [Array Operations](#array-operations)
4. [Change Tracking](#change-tracking)
5. [File Operations](#file-operations)
6. [Best Practices](#best-practices)

---

## Basic Operations

### Set Values

The `set()` method creates or updates values at any path:

```typescript
const doc = CanL3Document.fromJSON({ user: { name: 'Alice' } });

// Update existing
doc.set('user.name', 'Alice Smith');

// Add new property
doc.set('user.email', 'alice@example.com');

// Method chaining
doc
  .set('user.age', 30)
  .set('user.active', true)
  .set('user.role', 'admin');
```

### Delete Values

The `delete()` method removes values:

```typescript
// Delete property
doc.delete('user.temp');

// Delete from nested object
doc.delete('user.profile.old Data');

// Delete array element (with reindexing)
doc.delete('users[0]');
```

### Check Existence

```typescript
if (doc.exists('user.email')) {
  console.log('Email exists:', doc.get('user.email'));
}
```

---

## Path Creation

CanL3 automatically creates intermediate objects/arrays when setting deep paths:

```typescript
const doc = CanL3Document.fromJSON({});

// Creates: { user: { profile: { settings: { theme: 'dark' } } } }
doc.set('user.profile.settings.theme', 'dark');

// Creates: { items: ['first'] }
doc.set('items[0]', 'first');

// Mixed nesting
doc.set('data.list[0].name', 'Item 1');
// Creates: { data: { list: [{ name: 'Item 1' }] } }
```

---

## Array Operations

### Push & Pop

```typescript
const doc = CanL3Document.fromJSON({ items: [] });

// Push (add to end)
const newLength = doc.push('items', 1, 2, 3);
console.log('New length:', newLength); // 3

// Pop (remove from end)
const last = doc.pop('items');
console.log('Popped:', last); // 3
```

### Merge Objects

```typescript
doc.merge('user', {
  email: 'alice@example.com',
  verified: true,
  lastLogin: '2025-01-01'
});
// Shallow merge into user object
```

---

## Change Tracking

### Create Snapshots

```typescript
// Take a snapshot
const snapshot = doc.snapshot();

// Make changes
doc.set('version', '2.0.0');
doc.set('features.newFeature', true);

// snapshot is unchanged - independent copy
console.log(snapshot.get('version')); // Still '1.0.0'
```

### Generate Diffs

```typescript
const before = CanL3Document.fromJSON({ a: 1, b: 2, c: 3 });
const after = CanL3Document.fromJSON({ a: 1, b: 3, d: 4 });

const diff = before.diff(after);

console.log(diff.summary);
// {
//   added: 1,      // d was added
//   modified: 1,   // b was changed
//   deleted: 1,    // c was removed
//   total: 3
// }

console.log(diff.changes);
// [
//   { path: 'b', type: 'modified', oldValue: 2, newValue: 3 },
//   { path: 'c', type: 'deleted', oldValue: 3 },
//   { path: 'd', type: 'added', newValue: 4 }
// ]
```

### Human-Readable Diff

```typescript
console.log(before.diffString(after));
// Changes: 3
//   Added: 1
//   Modified: 1
//   Deleted: 1
//
// ~ b: 2 â†’ 3
// - c (was: 3)
// + d = 4
```

---

## File Operations

### Save Documents

```typescript
// Synchronous
doc.saveSync('data.CanL3');

// Asynchronous
await doc.save('data.CanL3');

// With encoding options
await doc.save('data.CanL3', {
  delimiter: '|',
  indent: 2,
  includeTypes: true
});
```

### Atomic File Editing

```typescript
import { FileEditor } from 'CanL3';

// Open file (creates backup automatically)
const editor = await FileEditor.open('config.CanL3', {
  backup: true,
  backupSuffix: '.bak'
});

// Modify data
editor.data.app.version = '2.0.0';
editor.data.users.push({ name: 'New User' });

// Check if modified
if (editor.isModified()) {
  // Save atomically (temp file + rename)
  await editor.save();
}

// Restore from backup if needed
await editor.restoreBackup();
```

---

## Best Practices

### 1. Use Snapshots for Transactions

```typescript
function updateWithRollback(doc: CanL3Document, updates: () => void) {
  const backup = doc.snapshot();

  try {
    updates();
    return { success: true };
  } catch (error) {
    // Rollback: create new doc from backup
    const restored = backup.snapshot();
    return { success: false, error, backup: restored };
  }
}

// Usage
const result = updateWithRollback(doc, () => {
  doc.set('config.timeout', 5000);
  doc.set('config.retries', 3);
});
```

### 2. Track All Changes for Audit

```typescript
const auditLog: any[] = [];
const initial = doc.snapshot();

// Make changes throughout the day
doc.set('user.lastLogin', new Date().toISOString());
// ... more changes ...

// At end of day, generate audit log
const dailyChanges = doc.diff(initial);
auditLog.push({
  date: new Date(),
  changes: dailyChanges.changes
});
```

### 3. Atomic Saves for Critical Data

```typescript
import { FileEditor } from 'CanL3';

// Always use FileEditor for important files
const editor = await FileEditor.open('critical-data.CanL3', {
  backup: true
});

try {
  // Make changes
  editor.data.balance += 100;

  // Validate
  if (editor.data.balance < 0) {
    throw new Error('Invalid balance');
  }

  // Save (atomic write + backup)
  await editor.save();
} catch (error) {
  console.error('Failed to update, backup preserved');
}
```

### 4. Method Chaining for Readability

```typescript
doc
  .set('user.name', 'Alice')
  .set('user.email', 'alice@example.com')
  .set('user.verified', true)
  .delete('user.tempToken');
```

---

## ðŸŽ“ Advanced Patterns

### Conditional Updates

```typescript
// Only update if exists
if (doc.exists('user.preferences')) {
  doc.merge('user.preferences', { theme: 'dark' });
}

// Update with validation
function safeSet(doc: CanL3Document, path: string, value: any) {
  const type = doc.typeOf(path);

  if (type && typeof value !== type) {
    throw new Error(`Type mismatch: expected ${type}, got ${typeof value}`);
  }

  doc.set(path, value);
}
```

### Bulk Updates

```typescript
// Update multiple paths
const updates = [
  ['user.firstName', 'Alice'],
  ['user.lastName', 'Smith'],
  ['user.email', 'alice@example.com']
];

for (const [path, value] of updates) {
  doc.set(path, value);
}
```

### Safe Concurrent Modifications

```typescript
// Lock-free update with retry
function optimisticUpdate(filePath: string, updateFn: (doc: CanL3Document) => void) {
  const original = CanL3Document.fromFileSync(filePath);
  const updated = original.snapshot();

  updateFn(updated);

  // Save and verify no concurrent changes
  updated.saveSync(filePath);
}
```

---

## ðŸš¨ Common Pitfalls

### âŒ Don't modify returned objects directly

```typescript
// BAD - modifies internal state without cache reset
const user = doc.get('user');
user.name = 'Bob';  // âŒ Won't work correctly

// GOOD - use set()
doc.set('user.name', 'Bob');  // âœ… Correct
```

### âŒ Don't forget to save

```typescript
// BAD - changes lost
doc.set('important', 'data');
// ... program exits ...

// GOOD - always save
doc.set('important', 'data');
await doc.save('file.CanL3');
```

### âŒ Don't use delete on root

```typescript
// BAD - can't delete root
doc.delete('$');  // âŒ Error

// GOOD - delete specific properties
doc.delete('propertyName');  // âœ… Works
```

---

## ðŸ“Š Performance Tips

1. **Batch related changes** before saving
2. **Use indices** for repeated lookups
3. **Use snapshots** sparingly (they create deep copies)
4. **Use FileEditor** for large files (atomic operations)
5. **Stream** when processing multi-GB files

---

## ðŸ”— Related

- [Query API](./QUERY_API.md) - How to query data
- [Indexing Guide](./INDEXING.md) - Fast lookups
- [Streaming Guide](./STREAMING.md) - Large files

---

**Happy modifying! ðŸŽ‰**


