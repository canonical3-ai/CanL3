/**
 * Core type definitions for CanL3 format
 */

export type CanL3Primitive = string | number | boolean | null | undefined;
export type CanL3Value = CanL3Primitive | CanL3Object | CanL3Array;
export interface CanL3Object { [key: string]: CanL3Value | undefined; }
export type CanL3Array = CanL3Value[];

export type CanL3TypeHint = "u32" | "i32" | "f64" | "bool" | "null" | "str" | "obj" | "list";
export type CanL3Delimiter = "," | "|" | "\t" | ";";

/**
 * Sentinel value to represent missing/undefined fields in tabular format.
 *
 * ## Behavior
 * - Distinguishes between explicit `null` (field exists with null value)
 *   and missing field (field doesn't exist in original data)
 * - Used in tabular encoding: trailing comma with nothing = missing field
 *
 * ## Encoding Rules
 * - Missing field (undefined or not in object): outputs nothing after delimiter
 * - Explicit empty string "": outputs `""`  (quoted empty string)
 * - Explicit null: outputs `null`
 *
 * ## Decoding Rules
 * - Empty value after delimiter: field is omitted from decoded object
 * - Quoted empty string `""`: decoded as empty string ""
 * - `null` literal: decoded as null
 *
 * ## Known Limitation
 * In tabular format rows, the parser currently treats unquoted empty and
 * quoted empty `""` identically due to quote stripping. Both become missing
 * fields. For explicit empty strings in tables, use key-value format instead:
 *
 * ```CanL3
 * # Preferred: explicit empty string as key-value
 * items[2]{name,value}:
 *   [0]:
 *     name: ""
 *     value: test
 *   [1]:
 *     name: Alice
 *     value: ""
 * ```
 *
 * ## History
 * BUG-001 FIX: Changed from "-" to "" (empty string) to avoid collision
 * with legitimate user data containing "-"
 *
 * @see https://github.com/user/CanL3/issues/001
 */
export const MISSING_FIELD_MARKER = "";

export interface EncodeOptions {
  delimiter?: CanL3Delimiter;
  includeTypes?: boolean;     // add :type hints to headers
  version?: string;           // default "1.0"
  indent?: number;            // spaces per level, default 2
  singleLinePrimitiveLists?: boolean; // default true
  prettyDelimiters?: boolean; // add spaces around delimiters (e.g., "1 , 2" instead of "1,2")
  compactTables?: boolean;    // use compact tabular format for nested data without repeated headers
  schemaFirst?: boolean;      // use schema-first format: define schema once, data as indented rows
}

export interface DecodeOptions {
  delimiter?: CanL3Delimiter; // if absent, auto-detect from header or heuristics
  strict?: boolean;          // enforce header N count, column counts, etc.
}

export interface CanL3Header {
  version?: string;
  delimiter?: CanL3Delimiter;
}

export interface CanL3ColumnDef {
  name: string;
  type?: CanL3TypeHint;
}

export interface CanL3ObjectHeader {
  key: string;
  columns: CanL3ColumnDef[];
  isArray?: boolean;
  arrayLength?: number;
}

export interface CanL3ParseContext {
  header: CanL3Header;
  strict: boolean;
  delimiter: CanL3Delimiter;
  currentLine?: number;      // Current line being parsed (for error reporting)
  allLines?: string[];       // All lines (for error context)
  currentDepth?: number;     // SECURITY FIX (SEC-002): Track recursion depth
  maxDepth?: number;         // SECURITY FIX (SEC-002): Maximum nesting depth (default: 100)
  maxBlockLines?: number;    // SECURITY FIX (Task 001): Maximum lines per block (default: 10000)
}

export interface CanL3EncodeContext {
  delimiter: CanL3Delimiter;
  includeTypes: boolean;
  version: string;
  indent: number;
  singleLinePrimitiveLists: boolean;
  prettyDelimiters: boolean;
  compactTables: boolean;
  schemaFirst: boolean;
  currentIndent: number;
  seen?: WeakSet<object>;  // Track circular references
  currentDepth?: number;     // BUG-NEW-002 FIX: Track recursion depth
  maxDepth?: number;         // BUG-NEW-002 FIX: Maximum nesting depth (default: 500)
}

/** Parser state for line-by-line processing */
export type ParserMode = "plain" | "inQuote" | "inTripleQuote";

export interface ParserState {
  mode: ParserMode;
  currentField: string;
  fields: string[];
  i: number;
  line: string;
  currentFieldWasQuoted: boolean;
}

