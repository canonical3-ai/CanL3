/**
 * CanL3 Decoder - Converts CanL3 format back to JSON
 */

import type { CanL3Value, CanL3Object, CanL3Array, CanL3ParseContext, CanL3Delimiter, CanL3ColumnDef } from "./types.js";
import { parseCanL3Line, parseHeaderLine, parseObjectHeader, detectDelimiter } from "./parser.js";
import { coerceValue, inferTypeFromString } from "./infer.js";
import { unquote } from "./utils/strings.js";
import { CanL3ParseError } from "./errors/index.js";
import { parseContent } from "./parser/content-parser.js";

/**
 * Decode a CanL3 formatted string back to JavaScript value.
 *
 * Parses CanL3 text and converts it to JavaScript objects, arrays,
 * and primitives. Supports auto-detection of delimiters and handles
 * all CanL3 features including tabular data, multiline strings, and
 * nested structures.
 *
 * @param text - The CanL3 formatted string to decode
 * @param opts - Decoding options
 * @param opts.delimiter - Override delimiter detection: "," | "|" | "\t" | ";" (default: auto-detect)
 * @param opts.strict - Enable strict parsing mode (default: false)
 * @returns Parsed JavaScript value (object, array, or primitive)
 * @throws {CanL3ParseError} When CanL3 syntax is invalid
 * @throws {CanL3ParseError} When delimiter is invalid
 * @throws {CanL3ParseError} When maximum nesting depth exceeded
 *
 * @example
 * ```typescript
 * // Basic decoding
 * const data = decodeCanL3(`
 * #version 1.0
 * root:
 *   name: Alice
 *   age: 30
 * `);
 * // Result: { name: 'Alice', age: 30 }
 *
 * // With explicit delimiter
 * const data = decodeCanL3(CanL3String, { delimiter: '|' });
 *
 * // Strict mode for validation
 * const data = decodeCanL3(CanL3String, { strict: true });
 * ```
 *
 * @since 1.0.0
 * @see encodeCanL3 - For encoding JavaScript to CanL3
 * @see CanL3Document.parse - For document-based API
 */
export function decodeCanL3(text: string, opts: {
  delimiter?: CanL3Delimiter;
  strict?: boolean;
} = {}): any {
  const strict = opts.strict ?? false;
  // Split lines and only remove \r (Windows line endings), don't trim other whitespace
  const lines = text.split('\n').map(line => line.replace(/\r$/, '')).filter(line => line.length > 0);

  if (lines.length === 0) {
    return {};
  }

  // Parse headers
  const context: CanL3ParseContext = {
    header: {},
    strict,
    delimiter: opts.delimiter || ",",
    allLines: lines,
    currentLine: 0
  };

  let dataStartIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // BUG-014 FIX: Only skip real @ directives, not @ symbol keys
    // Real directives are @keyword: value format (with colon)
    // @ symbol keys are @key: value but should be treated as data
    if (line.startsWith('@')) {
      const colonIndex = line.indexOf(':');
      const spaceIndex = line.indexOf(' ');
      const tabIndex = line.indexOf('\t');

      // Check if this looks like a real directive (@keyword: value format)
      // If colon comes first and it's a known directive keyword, skip it
      // Otherwise, treat it as data
      if (colonIndex > 0) {
        const keyword = line.substring(1, colonIndex).trim();
        const knownDirectives = ['version', 'delimiter', 'import', 'schema', 'type', 'description'];
        if (knownDirectives.includes(keyword)) {
          dataStartIndex = i + 1;
          continue;
        }
        // Not a known directive, treat as data (break out of header parsing)
        break;
      }
      // If no colon, this might be a malformed directive or data
      // For safety, treat as data
      break;
    }
    if (line.startsWith('#')) {
      const header = parseHeaderLine(line);
      if (header) {
        if (header.key === 'version') {
          context.header.version = header.value;
        } else if (header.key === 'delimiter') {
          // Parse delimiter, handle escaped tab
          if (header.value === '\\t') {
            context.header.delimiter = '\t';
          } else if (header.value === ',' || header.value === '|' || header.value === ';') {
            context.header.delimiter = header.value;
          } else {
            throw new CanL3ParseError(
              `Invalid delimiter: ${header.value}`,
              i,
              undefined,
              line,
              `Valid delimiters are: , | \\t ;`
            );
          }
        }
      }
      dataStartIndex = i + 1;
    } else {
      break;
    }
  }

  // Use delimiter from header or auto-detect if not specified
  if (!opts.delimiter) {
    if (context.header.delimiter) {
      context.delimiter = context.header.delimiter;
    } else {
      context.delimiter = detectDelimiter(text);
    }
  }

  // Parse data content
  const content = lines.slice(dataStartIndex).join('\n');
  if (!content) {
    return {};
  }

  const result = parseContent(content, context);

  // If the result has only one key called "root", unwrap it for better round-trip behavior
  if (result && typeof result === 'object' && Object.keys(result).length === 1 && 'root' in result) {
    return result.root;
  }

  return result;
}

/**
 * Parse the main content
 */


