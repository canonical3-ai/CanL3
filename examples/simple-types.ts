/**
 * Auto-generated TypeScript types from CanL3 schema
 * Do not edit manually - regenerate with: CanL3 generate-types
 */

export interface Root {
  /** @minimum 2 */
  name: string;
  /**
   * @minimum 0
   * @maximum 150
   */
  age: number;
  /** @pattern email */
  email: string;
}

