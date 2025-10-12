/**
 * Types for CanL3 Modification API
 */

import type { CanL3Value } from '../types.js';

/**
 * Modification operation type
 */
export type ModificationType = 'set' | 'delete' | 'insert' | 'update' | 'push' | 'pop';

/**
 * Modification result
 */
export interface ModificationResult {
  success: boolean;
  path: string;
  oldValue?: any;
  newValue?: any;
  error?: string;
}

/**
 * Set operation options
 */
export interface SetOptions {
  /**
   * Create intermediate objects/arrays if they don't exist
   * @default true
   */
  createPath?: boolean;

  /**
   * Validate against schema if available
   * @default true
   */
  validate?: boolean;

  /**
   * Coerce types if needed
   * @default false
   */
  coerce?: boolean;
}


