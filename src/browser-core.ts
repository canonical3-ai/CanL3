/**
 * CanL3 Browser Build - Core Features (No Node.js dependencies)
 *
 * This build includes only browser-safe features:
 * - encodeCanL3 / decodeCanL3
 * - Query parser and tokenizer
 * - Type definitions
 *
 * Excluded (Node.js-specific):
 * - CanL3Document (uses fs)
 * - FileEditor (uses fs)
 * - REPL (uses readline)
 * - Streaming (uses fs, readline)
 */

import { encodeCanL3 as _encodeCanL3 } from "./encode.js";
import { decodeCanL3 as _decodeCanL3 } from "./decode.js";

// Core types
export type { EncodeOptions, DecodeOptions, CanL3Value, CanL3Object, CanL3Array, CanL3TypeHint, CanL3Delimiter } from "./types.js";

// Core encode/decode functions
export { _encodeCanL3 as encodeCanL3, _decodeCanL3 as decodeCanL3 };

// Smart encoding function
export function encodeSmart(input: any, opts?: {
  delimiter?: "," | "|" | "\t" | ";";
  includeTypes?: boolean;
  version?: string;
  indent?: number;
  singleLinePrimitiveLists?: boolean;
}): string {
  const jsonStr = JSON.stringify(input);

  // Optimized delimiter counting - single pass through string (O(n) instead of O(4n))
  let commaCount = 0, pipeCount = 0, tabCount = 0, semicolonCount = 0;
  for (let i = 0; i < jsonStr.length; i++) {
    switch (jsonStr[i]) {
      case ',': commaCount++; break;
      case '|': pipeCount++; break;
      case '\t': tabCount++; break;
      case ';': semicolonCount++; break;
    }
  }

  let bestDelimiter: "," | "|" | "\t" | ";" = ",";
  let minQuoting = commaCount;

  if (pipeCount < minQuoting) {
    bestDelimiter = "|";
    minQuoting = pipeCount;
  }
  if (tabCount < minQuoting) {
    bestDelimiter = "\t";
    minQuoting = tabCount;
  }
  if (semicolonCount < minQuoting) {
    bestDelimiter = ";";
    minQuoting = semicolonCount;
  }

  const smartOpts = {
    delimiter: bestDelimiter,
    includeTypes: false,
    version: "1.0",
    indent: 2,
    singleLinePrimitiveLists: true,
    ...opts
  };

  return _encodeCanL3(input, smartOpts);
}

// Query API types and utilities (pure TypeScript, no Node.js deps)
export * from './query/types.js';
export { parsePath } from './query/path-parser.js';
export { tokenize } from './query/tokenizer.js';
export { validate, analyzeAST, optimizeAST, astToString } from './query/validator.js';

// Parser utilities (pure TypeScript)
export { parseCanL3Line, parseHeaderLine, parseObjectHeader, detectDelimiter } from "./parser.js";
export { inferPrimitiveType, coerceValue, isUniformObjectArray } from "./infer.js";


