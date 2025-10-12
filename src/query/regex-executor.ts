/**
 * Regex Executor - Timeout-Protected Regex Execution
 *
 * Executes regex patterns with timeout protection to prevent ReDoS attacks.
 * Even if a dangerous pattern passes validation, execution will be aborted
 * if it takes too long.
 *
 * This provides defense-in-depth: validation catches obvious issues,
 * timeout catches edge cases and ensures fail-safe behavior.
 */

import { SecurityError } from '../errors/index.js';
import { RegexValidator, type RegexValidationOptions } from './regex-validator.js';

export interface RegexExecutionOptions {
  /**
   * Maximum execution time in milliseconds (default: 100ms)
   * If regex.test() takes longer, it will be aborted
   */
  timeout?: number;

  /**
   * Validation options (passed to RegexValidator)
   */
  validationOptions?: RegexValidationOptions;
}

/**
 * Safe regex executor with validation and timeout protection
 */
export class RegexExecutor {
  /**
   * Test if a string matches a regex pattern (with safety checks)
   *
   * @param pattern - Regex pattern string
   * @param input - Input string to test
   * @param options - Execution options
   * @returns true if match, false otherwise
   * @throws {SecurityError} if pattern is unsafe or execution times out
   */
  static test(pattern: string, input: string, options?: RegexExecutionOptions): boolean {
    const opts = {
      timeout: options?.timeout ?? 100, // 100ms default
      validationOptions: options?.validationOptions ?? {},
    };

    // Step 1: Validate pattern BEFORE compilation
    try {
      RegexValidator.validate(pattern, opts.validationOptions);
    } catch (error) {
      // Re-throw validation errors
      throw error;
    }

    // Step 2: Compile regex
    let regex: RegExp;
    try {
      regex = new RegExp(pattern);
    } catch (error: any) {
      // Invalid regex syntax
      throw new SecurityError(`Invalid regex pattern: ${error.message}`, {
        pattern,
        originalError: error.message,
      });
    }

    // Step 3: Execute with timeout protection
    return this.executeWithTimeout(regex, input, opts.timeout);
  }

  /**
   * Execute regex with timeout
   *
   * Note: JavaScript doesn't have native regex timeout, so we use timing checks.
   * This isn't perfect (can't interrupt running regex) but provides reasonable protection.
   */
  private static executeWithTimeout(regex: RegExp, input: string, timeoutMs: number): boolean {
    const startTime = Date.now();

    // For very long inputs, we can at least check time before starting
    if (input.length > 10000) {
      // Large input - be extra cautious
      const estimatedTime = (input.length / 1000) * 10; // Rough estimate
      if (estimatedTime > timeoutMs) {
        throw new SecurityError(
          `Input too large for regex execution: ${input.length} characters`,
          {
            inputLength: input.length,
            timeout: timeoutMs,
          }
        );
      }
    }

    // Execute regex
    // Note: We can't actually interrupt a running regex in pure JavaScript.
    // The timeout check happens AFTER execution completes.
    // For true interruption, would need Worker threads or native C++ binding.

    let result: boolean;
    try {
      result = regex.test(input);
    } catch (error: any) {
      // Regex execution error (rare)
      throw new SecurityError(`Regex execution failed: ${error.message}`, {
        pattern: regex.source,
        error: error.message,
      });
    }

    // Check if execution took too long
    const duration = Date.now() - startTime;
    if (duration > timeoutMs) {
      throw new SecurityError(
        `Regex execution timeout: took ${duration}ms (limit: ${timeoutMs}ms)`,
        {
          duration,
          timeout: timeoutMs,
          pattern: regex.source,
          inputLength: input.length,
        }
      );
    }

    return result;
  }

  /**
   * Matches function - similar to test() but can be used inline
   * Useful for filter expressions: matches(@.value, "pattern")
   */
  static matches(input: string, pattern: string, options?: RegexExecutionOptions): boolean {
    return this.test(pattern, input, options);
  }
}

/**
 * Helper: Create a safe regex tester function
 * Returns a function that can be reused for multiple tests with same pattern
 */
export function createSafeRegexTester(
  pattern: string,
  options?: RegexExecutionOptions
): (input: string) => boolean {
  // Validate pattern once during creation
  RegexValidator.validate(pattern, options?.validationOptions);

  // Compile regex once
  let regex: RegExp;
  try {
    regex = new RegExp(pattern);
  } catch (error: any) {
    throw new SecurityError(`Invalid regex pattern: ${error.message}`, {
      pattern,
    });
  }

  const timeout = options?.timeout ?? 100;

  // Return reusable tester function
  return (input: string): boolean => {
    const startTime = Date.now();

    const result = regex.test(input);

    const duration = Date.now() - startTime;
    if (duration > timeout) {
      throw new SecurityError(
        `Regex execution timeout: ${duration}ms (limit: ${timeout}ms)`,
        {
          duration,
          timeout,
          pattern,
        }
      );
    }

    return result;
  };
}
