# CLI Additional Commands (v2.0.6)

## Query Command

Execute JSONPath-like queries on CanL3 or JSON files.

### Syntax

```bash
CanL3 query <file> <expression> [options]
```

### Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--out` | `-o` | Output file path | stdout |

### Examples

#### Basic Query

```bash
# Get all user names
CanL3 query users.CanL3 "users[*].name"

# Output: ["Alice", "Bob", "Charlie"]
```

#### Filter Query

```bash
# Find admin users
CanL3 query users.CanL3 "users[?(@.role == 'admin')]"

# Output: [{ "id": 1, "name": "Alice", "role": "admin" }, ...]
```

#### Recursive Query

```bash
# Find all email addresses at any depth
CanL3 query data.CanL3 "$..email"
```

#### Complex Filter

```bash
# Find active users over 25 years old
CanL3 query users.CanL3 "users[?(@.active && @.age > 25)]"
```

### Query Syntax

- **Property access:** `user.name`, `user.profile.email`
- **Array indexing:** `users[0]`, `users[-1]`
- **Wildcards:** `users[*].name`, `data.*`
- **Recursive descent:** `$..email`
- **Array slicing:** `users[0:5]`, `users[::2]`
- **Filters:** `users[?(@.age > 18)]`

**Filter Operators:**
- Comparison: `==`, `!=`, `>`, `<`, `>=`, `<=`
- Logical: `&&`, `||`, `!`
- String: `contains`, `startsWith`, `endsWith`, `matches`

---

## Get Command

Retrieve a single value at a specific path (simpler than query).

### Syntax

```bash
CanL3 get <file> <path> [options]
```

### Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--out` | `-o` | Output file path | stdout |

### Examples

#### Simple Path

```bash
# Get user name
CanL3 get config.CanL3 "database.host"

# Output: "localhost"
```

#### Array Index

```bash
# Get first user
CanL3 get users.CanL3 "users[0]"

# Output: { "id": 1, "name": "Alice" }
```

#### Negative Index

```bash
# Get last item
CanL3 get items.CanL3 "items[-1]"
```

### Get vs Query

- **get**: Fast, single-value retrieval, simple paths only
- **query**: Complex expressions, filters, wildcards, multiple results

---

## Combined Usage Examples

### Configuration Management

```bash
# Get database config
CanL3 get config.CanL3 "database"

# Update max connections
CanL3 set config.CanL3 "database.maxConnections" 200

# Validate changes
CanL3 query config.CanL3 "database"
```

### Data Analysis

```bash
# Count active users
CanL3 query users.CanL3 "users[?(@.active)]" | jq length

# Get all admin emails
CanL3 query users.CanL3 "users[?(@.role == 'admin')].email"

# Find users by age range
CanL3 query users.CanL3 "users[?(@.age >= 18 && @.age <= 65)]"
```

### Pipeline Processing

```bash
# Extract data and pass to next tool
CanL3 query data.CanL3 "items[*].price" | jq 'add / length'

# Filter and convert
CanL3 query users.CanL3 "users[?(@.active)]" > active-users.json
CanL3 encode active-users.json --out active-users.CanL3
```

---

## REPL Mode (Interactive) - v0.8.0+

Start an interactive REPL session for exploring CanL3 data.

### Syntax

```bash
CanL3 [repl] [file]
```

### Examples

```bash
# Start REPL
$ CanL3
CanL3 REPL v2.0.6
Type .help for commands

CanL3> .load users.CanL3
âœ“ Loaded: users.CanL3 (3.2 KB, 45 nodes)

CanL3> users[0].name
"Alice"

CanL3> users[?(@.age > 25)].name
["Alice", "Charlie"]

CanL3> .doc
Document Statistics:
  Size: 3.2 KB
  Nodes: 45
  Max Depth: 4
  Arrays: 3
  Objects: 15

CanL3> .exit
```

### REPL Commands

| Command | Description |
|---------|-------------|
| `.load <file>` | Load a CanL3 or JSON file |
| `.save <file>` | Save current document |
| `.doc` | Show document statistics |
| `.index <name> <field>` | Create an index |
| `.indices` | List all indices |
| `.help` | Show help |
| `.exit` | Exit REPL |

---

**For complete API documentation, see [API.md](./API.md)**

