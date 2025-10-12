# CanL3 v2.5.0 CLI Cheat Sheet

## Quick Start

```bash
npm install -g CanL3
CanL3 --version
CanL3 --help
```

---

## Commands

| Command | Description |
|---------|-------------|
| `encode` | JSON to CanL3 |
| `decode` | CanL3 to JSON |
| `stats` | Compression statistics |
| `format` | Format CanL3 file |
| `validate` | Validate against schema |
| `query` | JSONPath query |
| `get` | Get path value |
| `generate-types` | Schema to TypeScript |

---

## Encode

```bash
CanL3 encode data.json --out data.CanL3
CanL3 encode data.json --smart --stats --out data.CanL3
CanL3 encode data.json --optimize --verbose --stats
CanL3 encode data.json --delimiter "|" --include-types
CanL3 encode data.json --preprocess --indent 4
```

| Option | Description |
|--------|-------------|
| `--out` | Output file |
| `--smart` | Auto-optimize |
| `--optimize` | Advanced optimization |
| `--verbose` | Detailed analysis |
| `--stats` | Show statistics |
| `--delimiter` | `,` `\|` `\t` `;` |
| `--include-types` | Type hints |
| `--preprocess` | Clean keys |
| `--indent` | Spaces (default: 2) |

---

## Decode

```bash
CanL3 decode data.CanL3 --out data.json
CanL3 decode data.CanL3 --strict
```

| Option | Description |
|--------|-------------|
| `--out` | Output file |
| `--strict` | Strict parsing |
| `--delimiter` | Field delimiter |

---

## Stats

```bash
CanL3 stats data.json
CanL3 stats data.json --interactive
CanL3 stats data.json -i --theme neon
CanL3 stats data.json --tokenizer gpt-5
CanL3 stats data.json --compare
```

| Option | Description |
|--------|-------------|
| `-i, --interactive` | Interactive dashboard |
| `--theme` | `default` `neon` `matrix` `cyberpunk` |
| `--tokenizer` | LLM tokenizer |
| `--compare` | Comparison mode |
| `--verbose` | Detailed stats |

### Tokenizers
`gpt-5` `gpt-4.5` `gpt-4o` `claude-3.5` `gemini-2.0` `llama-4` `o200k` `cl100k`

---

## Format

```bash
CanL3 format data.CanL3 --pretty --out formatted.CanL3
CanL3 format data.CanL3 --indent 4 --include-types
```

| Option | Description |
|--------|-------------|
| `--out` | Output file |
| `--pretty` | Pretty format |
| `--indent` | Indentation |
| `--include-types` | Type hints |
| `--delimiter` | Field delimiter |

---

## Validate

```bash
CanL3 validate data.CanL3 --schema data.schema.CanL3
CanL3 validate data.CanL3 --schema data.schema.CanL3 --strict
```

| Option | Description |
|--------|-------------|
| `--schema` | Schema file (required) |
| `--strict` | Strict mode |

---

## Query & Get

```bash
CanL3 query data.CanL3 "users[?(@.age > 25)]"
CanL3 query data.json "$..email"
CanL3 get data.CanL3 "user.profile.email"
CanL3 query data.CanL3 "users[0]" --out result.json
```

### JSONPath Examples
| Expression | Result |
|------------|--------|
| `users[0]` | First user |
| `users[*].name` | All names |
| `users[?(@.age > 25)]` | Filter by age |
| `$..email` | All emails |
| `users[-1]` | Last user |

---

## Generate Types

```bash
CanL3 generate-types schema.CanL3 --out types.ts
```

| Option | Description |
|--------|-------------|
| `--out` | Output .ts file (required) |

---

## Delimiters

```bash
--delimiter ","   # Comma (default)
--delimiter "|"   # Pipe
--delimiter "\t"  # Tab
--delimiter ";"   # Semicolon
```

---

## Interactive Menu

```
1. Analyze another file
2. Compare two files
3. Change theme
4. Change tokenizer
5. Detailed statistics
6. Exit
```

---

## Workflows

### LLM Optimization
```bash
CanL3 stats data.json --tokenizer gpt-5
CanL3 encode data.json --optimize --stats --out optimized.CanL3
CanL3 decode optimized.CanL3 --out restored.json
```

### Schema Workflow
```bash
CanL3 generate-types schema.CanL3 --out types.ts
CanL3 validate data.CanL3 --schema schema.CanL3 --strict
CanL3 query data.CanL3 "users[?(@.active)]"
```

### Interactive Analysis
```bash
CanL3 stats data.json -i --theme neon
```

---

## v2.5.0 Highlights

- Advanced optimization (`--optimize`)
- 8 LLM tokenizers
- Interactive dashboard with 4 themes
- Schema validation (13 constraint types)
- JSONPath queries with filtering
- 791+ tests, 100% coverage
- Enterprise security hardening
