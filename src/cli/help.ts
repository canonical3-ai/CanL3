/**
 * CLI Help
 */

export function showHelp() {
  console.log(`
CanL3 (Token-Optimized Notation Language) CLI

Usage:
  CanL3 encode <file.json> [--out <file.CanL3>] [options]
  CanL3 decode <file.CanL3> [--out <file.json>] [--strict]
  CanL3 stats  [file.{json,CanL3}] [--tokenizer <type>] [--interactive] [--theme <theme>]
  CanL3 format <file.CanL3> [--pretty] [--out <file.CanL3>] [options]
  CanL3 validate <file.CanL3> --schema <file.schema.CanL3> [--strict]
  CanL3 generate-types <file.schema.CanL3> --out <file.ts>
  CanL3 query <file> <expression> [--out <file.json>]
  CanL3 get <file> <path> [--out <file.json>]

Options:
  --out <file>           Output file (default: stdout)
  --delimiter <,|\t|;|;> Field delimiter (default: ,)
  --include-types        Include type hints in headers
  --version <string>     CanL3 version (default: 1.0)
  --indent <number>      Indentation spaces (default: 2)
  --smart               Use smart encoding (auto-optimize)
  --stats               Show compression statistics
  --optimize            Apply advanced optimization strategies
  --verbose             Show detailed optimization analysis
  --strict              Enable strict parsing mode
  --pretty              Format with proper indentation (for format command)
  --schema <file>       Schema file for validation (.schema.CanL3)
  --tokenizer <type>    Token estimation (gpt-5, gpt-4.5, gpt-4o, claude-3.5, gemini-2.0, llama-4, o200k, cl100k)
  --preprocess         Transform problematic keys (#, @, "") to safe alternatives
  --interactive, -i    Launch interactive stats dashboard (EXPERIMENTAL)
  --theme <theme>      Color theme for interactive mode (default, neon, matrix, cyberpunk)
  --compare            Enable comparison mode for file analysis

Examples:
  CanL3 encode data.json --out data.CanL3 --smart --stats
  CanL3 encode data.json --optimize --stats --verbose
  CanL3 encode data.json --optimize dictionary,delta,bitpack
  CanL3 decode data.CanL3 --out data.json --strict
  CanL3 stats data.json --tokenizer gpt-5
  CanL3 format data.CanL3 --pretty --out formatted.CanL3
  CanL3 validate users.CanL3 --schema users.schema.CanL3 --strict
  CanL3 generate-types users.schema.CanL3 --out types.ts
  CanL3 query users.CanL3 "users[?(@.age > 18)]"
  CanL3 get data.CanL3 "user.profile.email"
  CanL3 stats data.json --interactive
  CanL3 stats data.CanL3 -i --theme cyberpunk
  CanL3 stats --interactive
`);
}
