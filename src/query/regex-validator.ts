/**
 * Regex Validator - ReDoS Protection
 *
 * Validates regex patterns to prevent Regular Expression Denial of Service (ReDoS) attacks.
 * Detects dangerous patterns like nested quantifiers, excessive nesting, and other
 * complexity indicators that can cause catastrophic backtracking.
 *
 * Security Note: This is a defense-in-depth measure. Even with validation,
 * regex execution should have timeout protection (see regex-executor.ts).
 */

import { SecurityError } from '../errors/index.js';

export interface RegexValidationOptions {
  /**
   * Maximum pattern length (default: 100 characters)
   * Longer patterns are more likely to be complex/malicious
   */
  maxLength?: number;

  /**
   * Maximum nesting depth of groups (default: 3)
   * Deep nesting can indicate complexity
   */
  maxNestingDepth?: number;

  /**
   * Allow backreferences like \1, \2 (default: false)
   * Backreferences can be slow and are rarely needed
   */
  allowBackreferences?: boolean;

  /**
   * Allow lookaheads/lookbehinds (default: false)
   * These can be slow and are often unnecessary
   */
  allowLookarounds?: boolean;
}

/**
 * Regex pattern validator with ReDoS protection
 */
export class RegexValidator {
  /**
   * Validate a regex pattern for safety
   *
   * @throws {SecurityError} if pattern is unsafe or too complex
   */
  static validate(pattern: string, options?: RegexValidationOptions): void {
    const opts: Required<RegexValidationOptions> = {
      maxLength: options?.maxLength ?? 100,
      maxNestingDepth: options?.maxNestingDepth ?? 3,
      allowBackreferences: options?.allowBackreferences ?? false,
      allowLookarounds: options?.allowLookarounds ?? false,
    };

    // 1. Type validation
    if (typeof pattern !== 'string') {
      throw new SecurityError('Regex pattern must be a string', {
        type: typeof pattern,
      });
    }

    // 2. Length validation
    if (pattern.length > opts.maxLength) {
      throw new SecurityError(
        `Regex pattern too long: ${pattern.length} characters (max: ${opts.maxLength})`,
        {
          length: pattern.length,
          maxLength: opts.maxLength,
        }
      );
    }

    // 3. Empty pattern is safe (matches everything)
    if (pattern.length === 0) {
      return;
    }

    // 4. Check for nested quantifiers (CRITICAL: causes catastrophic backtracking)
    if (this.hasNestedQuantifiers(pattern)) {
      throw new SecurityError(
        'Nested quantifiers detected - potential ReDoS attack',
        {
          pattern,
          issue: 'Patterns like (a+)+, (a*)*, (a+)* cause exponential time complexity',
        }
      );
    }

    // 5. Check for dangerous patterns
    const dangerousPattern = this.findDangerousPattern(pattern);
    if (dangerousPattern) {
      throw new SecurityError(
        `Unsafe regex pattern detected: ${dangerousPattern.description}`,
        {
          pattern,
          issue: dangerousPattern.description,
          detected: dangerousPattern.matched,
        }
      );
    }

    // 6. Check nesting depth
    const depth = this.getMaxNestingDepth(pattern);
    if (depth > opts.maxNestingDepth) {
      throw new SecurityError(
        `Regex nesting too deep: ${depth} levels (max: ${opts.maxNestingDepth})`,
        {
          depth,
          maxDepth: opts.maxNestingDepth,
        }
      );
    }

    // 7. Check backreferences (if disallowed)
    if (!opts.allowBackreferences && this.hasBackreferences(pattern)) {
      throw new SecurityError(
        'Backreferences not allowed in regex patterns',
        {
          pattern,
          issue: 'Backreferences (\\1, \\2, etc.) can be slow',
        }
      );
    }

    // 8. Check lookarounds (if disallowed)
    if (!opts.allowLookarounds && this.hasLookarounds(pattern)) {
      throw new SecurityError(
        'Lookaheads/lookbehinds not allowed in regex patterns',
        {
          pattern,
          issue: 'Lookarounds (?=, ?!, ?<=, ?<!) can be slow',
        }
      );
    }

    // Pattern is safe!
  }

  /**
   * Detect nested quantifiers like (a+)+, (a*)*, etc.
   * This is the PRIMARY ReDoS vulnerability pattern.
   */
  private static hasNestedQuantifiers(pattern: string): boolean {
    // Match: (content with quantifier) followed by quantifier
    // Examples: (a+)+, (a*)+, (a?)*, (a{2,})+

    // Pattern explanation:
    // \( - opening paren
    // [^)]* - any content (non-greedy)
    // [+*?{] - inner quantifier
    // [^)]* - more content
    // \) - closing paren
    // [+*?{] - outer quantifier

    const nestedQuantifierPattern = /\([^)]*[+*?{][^)]*\)[+*?{]/;

    if (nestedQuantifierPattern.test(pattern)) {
      return true;
    }

    // Also check for alternation with quantifiers: (a|a)+
    const alternationQuantifierPattern = /\([^)]*\|[^)]*\)[+*?{]/;
    if (alternationQuantifierPattern.test(pattern)) {
      // Check if alternations overlap (dangerous)
      // This is a simplified check - full overlap detection is complex
      if (/\([^)]*\|[^)]*\)[*+]/.test(pattern)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Find other dangerous patterns
   */
  private static findDangerousPattern(pattern: string): { matched: string; description: string } | null {
    const dangerousPatterns = [
      {
        regex: /\(\?=/,
        description: 'Positive lookahead - can be slow',
      },
      {
        regex: /\(\?!/,
        description: 'Negative lookahead - can be slow',
      },
      {
        regex: /\(\?<=/,
        description: 'Positive lookbehind - can be slow',
      },
      {
        regex: /\(\?<!/,
        description: 'Negative lookbehind - can be slow',
      },
      {
        regex: /\(\?\)/,
        description: 'Empty group',
      },
      {
        regex: /\([^)]*\|\)/,
        description: 'Empty alternative in group - ambiguous',
      },
      {
        regex: /\|\|/,
        description: 'Adjacent alternation operators',
      },
      {
        regex: /\*\*|\+\+|\?\?/,
        description: 'Adjacent quantifiers',
      },
    ];

    for (const { regex, description } of dangerousPatterns) {
      const match = pattern.match(regex);
      if (match) {
        return {
          matched: match[0],
          description,
        };
      }
    }

    return null;
  }

  /**
   * Calculate maximum nesting depth of parentheses/groups
   */
  private static getMaxNestingDepth(pattern: string): number {
    let depth = 0;
    let maxDepth = 0;
    let escaped = false;

    for (let i = 0; i < pattern.length; i++) {
      const char = pattern[i];

      // Handle escape sequences
      if (char === '\\' && !escaped) {
        escaped = true;
        continue;
      }

      // Skip escaped characters
      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === '(') {
        depth++;
        maxDepth = Math.max(maxDepth, depth);
      } else if (char === ')') {
        depth--;
        if (depth < 0) {
          // Unbalanced parentheses - let regex engine handle this error
          return maxDepth;
        }
      }
    }

    return maxDepth;
  }

  /**
   * Detect backreferences: \1, \2, etc.
   */
  private static hasBackreferences(pattern: string): boolean {
    // Match: backslash followed by digit (not in character class)
    // This is a simplified check - doesn't handle all edge cases
    return /\\[1-9]/.test(pattern);
  }

  /**
   * Detect lookarounds: (?=, ?!, ?<=, ?<!
   */
  private static hasLookarounds(pattern: string): boolean {
    return /\(\?[=!]|\(\?<[=!]/.test(pattern);
  }

  /**
   * Quick check if pattern is obviously safe (performance optimization)
   */
  static isSafePattern(pattern: string): boolean {
    // Patterns without quantifiers or groups are generally safe
    if (!/[+*?{(]/.test(pattern)) {
      return true;
    }

    // Simple patterns with single quantifiers are usually safe
    // (but still validate them to be sure)
    return false;
  }
}
