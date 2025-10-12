# CanL3 CLI Documentation

The CanL3 Command Line Interface provides powerful tools for converting, analyzing, and optimizing CanL3 data.

## ðŸŽ‰ v2.1.0 - Bug Fix Release

**Updated CLI documentation** with latest bug fix improvements:

- **Version consistency** - Aligned CLI documentation with current version
- **Updated examples** - All CLI commands verified with current version
- **Feature completeness** - All documented features available and tested

## ðŸŽ‰ v2.0.6 - Dual-Mode System

The CLI now supports **dual-mode encoding** allowing you to choose between:

- **Default Mode (Quoting Only)**: Perfect round-trip safety with automatic key quoting
- **Preprocessing Mode**: Clean, readable output with key transformation

### Dual-Mode Examples

**Problematic JSON:**
```json
{"#":"}","":"","key with spaces":"value","@type":"special"}
```

**Default Mode (Perfect Round-trip):**
```bash
CanL3 encode problem.json
```
```CanL3
"#"[1]:
  "}"
""[1]:
  ""
"key with spaces"[1]:
  value
"@type"[1]:
  special
```

**Preprocessing Mode (Clean Output):**
```bash
CanL3 encode problem.json --preprocess
```
```CanL3
#comment[1]:
  "}"
empty[1]:
  ""
key_with_spaces[1]:
  value
type[1]:
  special
```

### When to Use Each Mode

- **Default Mode**: Data integrity, configuration files, API responses, when exact round-trip matters
- **Preprocessing Mode**: Data analysis, LLM prompts, temporary files, when readability is priority

## Installation

```bash
# Local development
npm link

# Global installation
npm install -g CanL3
```

## Overview

The CLI provides eight main commands:

- `CanL3 encode` - Convert JSON to CanL3 with optimization options
- `CanL3 decode` - Convert CanL3 to JSON
- `CanL3 stats` - Analyze and compare data formats
- `CanL3 format` - Format and prettify CanL3 files
- `CanL3 validate` - Validate CanL3 data against schema
- `CanL3 generate-types` - Generate TypeScript types from schema
- `CanL3 query` - Query CanL3 files with JSONPath expressions
- `CanL3 get` - Get specific values from CanL3 files

## Global Options

These options are available across all commands:

```bash
-h, --help              Show help information
-v, --version           Display version information
--quiet                 Suppress non-error output
--verbose               Enable detailed logging
```

## Encode Command

Convert JSON data to CanL3 format.

### Syntax

```bash
CanL3 encode <input.json> [options]
```

### Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--out` | `-o` | Output file path | stdout |
| `--delimiter` | `-d` | Field delimiter | `,` |
| `--include-types` | `-t` | Add type hints to headers | `false` |
| `--version` | | CanL3 version | `1.0` |
| `--indent` | `-i` | Indentation spaces | `2` |
| `--smart` | `-s` | Use smart encoding | `false` |
| `--stats` | | Show encoding statistics | `false` |
| `--preprocess` | `-p` | Preprocess JSON keys for readability | `false` |

### Supported Delimiters

- `,` - Comma (default)
- `|` - Pipe
- `\t` - Tab
- `;` - Semicolon

### Basic Usage

```bash
# Basic encoding (default mode with quoting)
CanL3 encode data.json

# Output to file
CanL3 encode data.json --out data.CanL3

# Use smart encoding with statistics
CanL3 encode data.json --smart --stats

# Preprocessing mode for problematic keys
CanL3 encode problem-data.json --preprocess --out clean.CanL3
```

### Advanced Usage

```bash
# Custom delimiter with type hints
CanL3 encode users.json --delimiter "|" --include-types

# Compact encoding for large datasets
CanL3 encode large-dataset.json --indent 0 --smart

# Preprocessing with custom delimiter
CanL3 encode messy-data.json --preprocess --delimiter "|" --stats

# Batch processing with preprocessing
for file in *.json; do
  CanL3 encode "$file" --preprocess --out "${file%.json}.CanL3" --smart --stats
done
```

### Examples

#### Basic Encoding

**Input (users.json):**
```json
{
  "users": [
    { "id": 1, "name": "Alice", "role": "admin" },
    { "id": 2, "name": "Bob, Jr.", "role": "user" }
  ]
}
```

**Command:**
```bash
CanL3 encode users.json
```

**Output:**
```
#version 1.0
users[2]{id:u32,name:str,role:str}:
  1, Alice, admin
  2, "Bob, Jr.", user
```

#### Dual-Mode Encoding Comparison

**Problematic JSON (messy-keys.json):**
```json
{
  "#": "hash-key",
  "": "empty-key",
  "key with spaces": "spaced-key",
  "@type": "at-symbol-key"
}
```

**Default Mode (Perfect Round-trip):**
```bash
CanL3 encode messy-keys.json
```
```CanL3
"#"[1]:
  hash-key
""[1]:
  empty-key
"key with spaces"[1]:
  spaced-key
"@type"[1]:
  at-symbol-key
```

**Preprocessing Mode (Clean Output):**
```bash
CanL3 encode messy-keys.json --preprocess
```
```CanL3
#comment[1]:
  hash-key
empty[1]:
  empty-key
key_with_spaces[1]:
  spaced-key
type[1]:
  at-symbol-key
```

#### Smart Encoding

**Command:**
```bash
CanL3 encode complex-data.json --smart --stats
```

**Output:**
```
CanL3 Encoding Statistics:
========================
Input file: complex-data.json
Output file: stdout
Encoding: smart
Delimiter: |
Original size: 1,247 bytes
CanL3 size: 843 bytes
Compression: 32.4%
Estimated tokens: 287 (vs 456 for JSON)
```

## Decode Command

Convert CanL3 data back to JSON format.

### Syntax

```bash
CanL3 decode <input.CanL3> [options]
```

### Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--out` | `-o` | Output file path | stdout |
| `--strict` | `-s` | Enable strict mode validation | `false` |
| `--delimiter` | `-d` | Force specific delimiter | auto-detect |

### Basic Usage

```bash
# Basic decoding
CanL3 decode data.CanL3

# Output to file
CanL3 decode data.CanL3 --out data.json

# Strict validation
CanL3 decode data.CanL3 --strict
```

### Advanced Usage

```bash
# Force specific delimiter
CanL3 decode data.CanL3 --delimiter "|"

# Batch processing
for file in *.CanL3; do
  CanL3 decode "$file" --out "${file%.CanL3}.json"
done

# Validation only
CanL3 decode data.CanL3 --strict --out /dev/null
```

### Examples

#### Basic Decoding

**Input (data.CanL3):**
```
#version 1.0
users[2]{id:u32,name:str,role:str}:
  1, Alice, admin
  2, "Bob, Jr.", user
```

**Command:**
```bash
CanL3 decode data.CanL3
```

**Output:**
```json
{
  "users": [
    { "id": 1, "name": "Alice", "role": "admin" },
    { "id": 2, "name": "Bob, Jr.", "role": "user" }
  ]
}
```

#### Strict Mode Validation

**Command:**
```bash
CanL3 decode data.CanL3 --strict
```

**Output (on error):**
```
Error: Validation failed in strict mode:
  - Row 2 has 3 columns, expected 2
  - Value 'invalid' cannot be coerced to u32
```

## Stats Command

Analyze and compare data formats with size and token estimates.

### Syntax

```bash
CanL3 stats <input.(json|CanL3)> [options]
```

### Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--tokenizer` | `-t` | Tokenizer model for estimation | `gpt-5` |
| `--delimiter` | `-d` | Delimiter for JSON-to-CanL3 conversion | auto-detect |
| `--compare` | `-c` | Compare with other formats | `json,CanL3` |
| `--output` | `-o` | Output format (text|json) | `text` |

### Supported Tokenizers

- `gpt-5` - Latest GPT-5 model (default)
- `gpt-4.5` - GPT-4.5 Turbo
- `gpt-4o` - GPT-4o
- `claude-3.5` - Claude 3.5 Sonnet
- `gemini-2.0` - Google Gemini 2.0
- `llama-4` - Meta Llama 4
- `o200k` - GPT-4o base tokenizer
- `cl100k` - Legacy GPT-4 tokenizer

### Basic Usage

```bash
# Analyze JSON file
CanL3 stats data.json

# Analyze CanL3 file
CanL3 stats data.CanL3

# Use specific tokenizer
CanL3 stats data.json --tokenizer gpt-4o

# JSON output for integration
CanL3 stats data.json --output json
```

### Advanced Usage

```bash
# Comprehensive comparison
CanL3 stats data.json --compare json,CanL3,csv --tokenizer o200k

# Batch analysis
for file in *.json; do
  echo "=== $file ==="
  CanL3 stats "$file" --tokenizer cl100k
  echo
done

# Save analysis results
CanL3 stats data.json --output json > analysis-results.json
```

### Examples

#### Basic Statistics

**Command:**
```bash
CanL3 stats users.json
```

**Output:**
```
File Analysis: users.json
=========================
Original Format: JSON
File Size: 2,456 bytes

Estimated Tokens:
  JSON (cl100k): 89 tokens
  CanL3 (default): 54 tokens
  CanL3 (smart): 49 tokens

Size Comparison:
  JSON: 2,456 bytes
  CanL3: 1,687 bytes
  Savings: 453 bytes (18.4%)

Token Savings:
  JSON: 89 tokens
  CanL3: 49 tokens
  Savings: 40 tokens (44.9%)
```

#### JSON Output

**Command:**
```bash
CanL3 stats data.json --output json
```

**Output:**
```json
{
  "file": "data.json",
  "originalSize": 2456,
  "CanL3Size": 1687,
  "savings": {
    "bytes": 769,
    "percentage": 31.3
  },
  "tokens": {
    "cl100k": {
      "json": 89,
      "CanL3": 54,
      "CanL3Smart": 49
    }
  },
  "recommendations": [
    "Use smart encoding for optimal token savings",
    "Consider pipe delimiter to reduce quoting",
    "Enable type hints for validation"
  ]
}
```

#### Comprehensive Comparison

**Command:**
```bash
CanL3 stats complex-data.json --compare json,CanL3 --tokenizer o200k
```

**Output:**
```
Comprehensive Format Analysis
=============================
File: complex-data.json
Tokenizer: o200k (GPT-4o)

Format Comparison:
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ Format  â”‚   Bytes  â”‚ Tokens   â”‚ % Reduction â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ JSON    â”‚   4,567  â”‚    156   â”‚     â€”      â”‚
â”‚ CanL3    â”‚   3,124  â”‚    109   â”‚   30.1%    â”‚
â”‚ CanL3*   â”‚   2,987  â”‚     98   â”‚   37.2%    â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
*CanL3 with smart encoding

Recommendations:
â€¢ Use smart encoding for maximum efficiency
â€¢ Pipe delimiter recommended (reduces quoting by 23%)
â€¢ Add type hints for better validation
â€¢ Consider compression for storage
```

## Workflows and Pipelines

### Basic Data Pipeline

```bash
# Convert JSON to optimized CanL3 (default mode)
CanL3 encode input.json --smart --stats --out optimized.CanL3

# Clean up problematic keys with preprocessing
CanL3 encode messy-input.json --preprocess --smart --stats --out clean.CanL3

# Use the optimized file in your application
your-app --data optimized.CanL3

# Convert back to JSON when needed
CanL3 decode optimized.CanL3 --out output.json
```

### Batch Processing Pipeline

```bash
#!/bin/bash
# process-data.sh

set -e

echo "Starting CanL3 batch processing..."

# Create output directory
mkdir -p CanL3-output

# Process all JSON files
for json_file in data/*.json; do
  basename=$(basename "$json_file" .json)
  echo "Processing $json_file..."

  # Convert to CanL3 with smart encoding
  CanL3 encode "$json_file" \
    --smart \
    --stats \
    --out "CanL3-output/${basename}.CanL3"
done

echo "Batch processing complete!"
echo "Summary:"
ls -la CanL3-output/
```

### Data Validation Pipeline

```bash
#!/bin/bash
# validate-data.sh

echo "Validating CanL3 files..."

for CanL3_file in *.CanL3; do
  echo "Validating $CanL3_file..."

  # Try to decode with strict mode
  if CanL3 decode "$CanL3_file" --strict --out /dev/null 2>/dev/null; then
    echo "âœ“ $CanL3_file - Valid"
  else
    echo "âœ— $CanL3_file - Invalid"
    CanL3 decode "$CanL3_file" --out "temp-${CanL3_file%.CanL3}.json"
  fi
done

# Clean up temporary files
rm -f temp-*.json
```

### CI/CD Integration

```yaml
# .github/workflows/CanL3-validation.yml
name: CanL3 Validation

on: [push, pull_request]

jobs:
  validate-CanL3:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2

    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'

    - name: Install CanL3
      run: npm install -g CanL3

    - name: Validate CanL3 files
      run: |
        for file in data/*.CanL3; do
          CanL3 decode "$file" --strict
        done

    - name: Check token efficiency
      run: |
        for file in data/*.json; do
          CanL3 stats "$file" --output json >> stats.json
        done

        # Check if token savings meet threshold
        node scripts/check-efficiency.js stats.json
```

## Performance Tips

### Encoding Optimization

1. **Use smart encoding** for automatic optimization
2. **Choose appropriate delimiter** based on data characteristics
3. **Enable type hints** only when validation is needed
4. **Minimize indentation** for storage efficiency

### Decoding Optimization

1. **Skip strict mode** when validation isn't required
2. **Specify delimiter** explicitly for faster parsing
3. **Process files in batches** for better memory usage
4. **Use streaming** for large files (future feature)

### Token Optimization

1. **Analyze data patterns** with stats command
2. **Choose optimal delimiter** to minimize quoting
3. **Compact field names** where appropriate
4. **Consider smart encoding** for automatic optimization

## Troubleshooting

### Common Issues

#### Encoding Errors

**Problem:** Characters not displaying correctly
```bash
CanL3 encode data.json --out data.CanL3
# Error: Invalid character encoding
```

**Solution:** Ensure UTF-8 encoding
```bash
iconv -f utf-8 -t utf-8 data.json > data-utf8.json
CanL3 encode data-utf8.json --out data.CanL3
```

#### Decoding Errors

**Problem:** Strict mode validation fails
```bash
CanL3 decode data.CanL3 --strict
# Error: Row 3 has 4 columns, expected 3
```

**Solution:** Fix data or use non-strict mode
```bash
# Check the problematic data
CanL3 decode data.CanL3 --out temp.json
cat temp.json | jq '.users[2]'

# Or use non-strict mode
CanL3 decode data.CanL3
```

#### Memory Issues

**Problem:** Large files cause memory errors
```bash
CanL3 encode large-dataset.json
# Error: JavaScript heap out of memory
```

**Solution:** Increase Node.js memory limit
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
CanL3 encode large-dataset.json
```

### Debug Mode

Enable verbose logging for troubleshooting:

```bash
CanL3_DEBUG=1 CanL3 encode data.json --smart
CanL3_DEBUG=1 CanL3 decode data.CanL3 --strict
```

### Getting Help

```bash
# General help
CanL3 --help

# Command-specific help
CanL3 encode --help
CanL3 decode --help
CanL3 stats --help

# Version information
CanL3 --version
```

## Integration Examples

### Node.js Integration

```javascript
const { execSync } = require('child_process');

function convertToCanL3(data, options = {}) {
  const tempJson = '/tmp/temp.json';
  const tempCanL3 = '/tmp/temp.CanL3';

  // Write data to temporary file
  require('fs').writeFileSync(tempJson, JSON.stringify(data));

  // Build command
  const cmd = ['CanL3', 'encode', tempJson];
  if (options.smart) cmd.push('--smart');
  if (options.delimiter) cmd.push('--delimiter', options.delimiter);
  if (options.stats) cmd.push('--stats');
  cmd.push('--out', tempCanL3);

  // Execute command
  execSync(cmd.join(' '), { stdio: 'inherit' });

  // Read result
  const result = require('fs').readFileSync(tempCanL3, 'utf8');

  // Cleanup
  require('fs').unlinkSync(tempJson);
  require('fs').unlinkSync(tempCanL3);

  return result;
}
```

### Python Integration

```python
import subprocess
import json
import tempfile
import os

def json_to_CanL3(data, smart=True, delimiter=None):
    """Convert Python dict/list to CanL3 format"""

    # Create temporary files
    with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as json_file:
        json.dump(data, json_file)
        json_path = json_file.name

    # Build command
    cmd = ['CanL3', 'encode', json_path]
    if smart:
        cmd.append('--smart')
    if delimiter:
        cmd.extend(['--delimiter', delimiter])

    # Execute command
    result = subprocess.run(cmd, capture_output=True, text=True)

    # Cleanup
    os.unlink(json_path)

    if result.returncode != 0:
        raise Exception(f"CanL3 conversion failed: {result.stderr}")

    return result.stdout

# Usage
data = {"users": [{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}]}
CanL3_output = json_to_CanL3(data, smart=True)
print(CanL3_output)
```

---

## Query and Get Commands (v2.0.0+)

### Query Command

Query CanL3 files using JSONPath expressions.

#### Syntax

```bash
CanL3 query <file> <expression> [options]
```

#### Options

| Option | Description |
|--------|-------------|
| `--out <file>` | Save query result to file |
| `--pretty` | Format JSON output |

#### Examples

```bash
# Get all users
CanL3 query users.CanL3 "users"

# Filter users by age
CanL3 query users.CanL3 "users[?(@.age > 25)]"

# Get all email addresses
CanL3 query users.CanL3 "$..email"

# Complex query with multiple conditions
CanL3 query data.CanL3 "users[?(@.active && @.role == 'admin')]"

# Save result to file
CanL3 query users.CanL3 "users[?(@.department == 'Engineering')]" --out engineers.json
```

### Get Command

Get a specific value from a CanL3 file.

#### Syntax

```bash
CanL3 get <file> <path> [options]
```

#### Examples

```bash
# Get specific user
CanL3 get users.CanL3 "users[0]"

# Get nested property
CanL3 get config.CanL3 "database.connection.url"

# Get array element
CanL3 get data.CanL3 "items[2].price"
```

---

## Optimization Features (v2.0.0+)

The CanL3 CLI now includes advanced optimization features for additional compression savings.

### Smart Encoding with Optimization

```bash
# Enable all optimization strategies
CanL3 encode data.json --smart --optimize --stats

# Use specific optimization strategies
CanL3 encode data.json --optimize dictionary,delta,bitpack --stats

# Show detailed optimization analysis
CanL3 encode data.json --optimize --verbose --stats
```

### Optimization Strategies

| Strategy | Description | Best For |
|----------|-------------|----------|
| `dictionary` | Compress repetitive values | Categorical data, enums |
| `delta` | Compress sequential numbers | Timestamps, IDs, counters |
| `bitpack` | Compress booleans and flags | Status fields, binary data |
| `rle` | Run-length encoding | Repeated patterns |
| `quantize` | Reduce numeric precision | Floating point data |
| `column-reorder` | Optimize field order | Tabular data |

### Example with Optimization

```bash
# Original data
CanL3 encode employees.json --stats
# Output: 2.1MB, 145,230 tokens

# With optimization
CanL3 encode employees.json --smart --optimize --stats
# Output: 1.4MB, 87,450 tokens (33% additional savings)

# Optimization analysis
CanL3 encode employees.json --optimize --verbose
# Output:
# Applying optimizations:
# âœ“ Dictionary encoding for 'department' (saves 23.4KB)
# âœ“ Delta encoding for 'employee_id' (saves 15.2KB)
# âœ“ Bit packing for 'active' flag (saves 8.7KB)
# âœ“ Column reordering (saves 12.1KB)
#
# Total optimization savings: 59.4KB (2.8% additional)
```

The CanL3 CLI provides a comprehensive toolkit for working with CanL3 data, from simple conversions to complex data analysis and optimization workflows.

