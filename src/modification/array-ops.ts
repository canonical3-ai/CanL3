/**
 * Array-specific operations
 */

import { parsePath } from '../query/path-parser.js';
import { evaluate } from '../query/evaluator.js';

/**
 * Push value(s) to end of array at path
 */
export function push(document: any, arrayPath: string, ...values: any[]): number {
  const parseResult = parsePath(arrayPath);
  if (!parseResult.success) {
    throw parseResult.error!;
  }

  const arr = evaluate(document, parseResult.ast);
  if (!Array.isArray(arr)) {
    throw new Error(`Path '${arrayPath}' is not an array`);
  }

  arr.push(...values);
  return arr.length;
}

/**
 * Remove and return last element
 */
export function pop(document: any, arrayPath: string): any {
  const parseResult = parsePath(arrayPath);
  if (!parseResult.success) {
    throw parseResult.error!;
  }

  const arr = evaluate(document, parseResult.ast);
  if (!Array.isArray(arr)) {
    throw new Error(`Path '${arrayPath}' is not an array`);
  }

  return arr.pop();
}

/**
 * Add value(s) to beginning of array
 */
export function unshift(document: any, arrayPath: string, ...values: any[]): number {
  const parseResult = parsePath(arrayPath);
  if (!parseResult.success) {
    throw parseResult.error!;
  }

  const arr = evaluate(document, parseResult.ast);
  if (!Array.isArray(arr)) {
    throw new Error(`Path '${arrayPath}' is not an array`);
  }

  arr.unshift(...values);
  return arr.length;
}

/**
 * Remove and return first element
 */
export function shift(document: any, arrayPath: string): any {
  const parseResult = parsePath(arrayPath);
  if (!parseResult.success) {
    throw parseResult.error!;
  }

  const arr = evaluate(document, parseResult.ast);
  if (!Array.isArray(arr)) {
    throw new Error(`Path '${arrayPath}' is not an array`);
  }

  return arr.shift();
}
