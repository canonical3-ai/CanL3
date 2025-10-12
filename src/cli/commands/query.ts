/**
 * Query Command
 */

import { decodeCanL3 } from "../../index.js";
import { safeJsonParse } from "../../utils/strings.js";
import { QuerySanitizer } from "../query-sanitizer.js";
import { SecurityError } from "../../errors/index.js";
import { safeWriteFile } from "../utils.js";
import type { Command, CommandContext } from "../types.js";
import type { CanL3Value } from "../../types.js";

export const QueryCommand: Command = {
  name: "query",
  description: "Query CanL3 or JSON files with JSONPath expressions",

  async execute(context: CommandContext): Promise<void> {
    const { file, options, input } = context;

    if (!file.endsWith('.CanL3') && !file.endsWith('.json')) {
      console.error("âŒ Error: query/get requires a .CanL3 or .json file");
      process.exit(1);
    }

    // Parse file (already safely read)
    let data: any;

    if (file.endsWith('.json')) {
      data = safeJsonParse(input) as CanL3Value;
    } else {
      data = decodeCanL3(input, { delimiter: options.delimiter });
    }

    // Get query expression from context (provided by the main CLI)
    const queryExpr = context.queryExpression;

    if (!queryExpr) {
      console.error("âŒ Error: Query expression required");
      console.error("Usage: CanL3 query <file> <expression>");
      console.error('Example: CanL3 query data.CanL3 "users[?(@.age > 25)]"');
      process.exit(1);
    }

    // Execute query
    // SECURITY FIX (BF007): Wrap async import in try-catch
    let CanL3Document;
    try {
      const module = await import('../../document.js');
      CanL3Document = module.CanL3Document;
      // BUG-NEW-014 FIX: Validate CanL3Document was successfully imported
      if (!CanL3Document) {
        throw new Error('CanL3Document export not found in module');
      }
    } catch (error) {
      console.error('âŒ Failed to load document module:', error);
      process.exit(1);
    }

    const doc = CanL3Document.fromJSON(data);
    const result = context.commandType === 'get' ? doc.get(queryExpr) : doc.query(queryExpr);

    // Output result
    if (options.out) {
      safeWriteFile(options.out, JSON.stringify(result, null, 2));
      console.log(`âœ… Query result saved to ${options.out}`);
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
  }
};

/**
 * Process query arguments from raw CLI args
 */
export function processQueryArgs(args: string[], command: string, file: string): string {
  // Find indices of command and file to determine where query expression starts
  const commandIndex = args.indexOf(command);
  const fileIndex = args.indexOf(file);
  const queryStartIndex = Math.max(commandIndex, fileIndex) + 1;

  // Collect all remaining non-option args and join them
  // This handles cases where the expression contains spaces
  const rawQuery = args
    .slice(queryStartIndex)
    .filter(a => !a.startsWith('-'))
    .join(' ')
    .trim();

  if (!rawQuery) {
    console.error("âŒ Error: Query expression required");
    console.error("Usage: CanL3 query <file> <expression>");
    console.error('Example: CanL3 query data.CanL3 "users[?(@.age > 25)]"');
    process.exit(1);
  }

  // SECURITY FIX (BF005): Sanitize query expression
  let queryExpr: string;
  try {
    queryExpr = QuerySanitizer.sanitize(rawQuery, {
      maxLength: 1000,
      maxDepth: 100,
    });
  } catch (error) {
    if (error instanceof SecurityError) {
      console.error(`âŒ Security Error: ${error.message}`);
      console.error(`âŒ Query blocked: ${QuerySanitizer.sanitizeForLogging(rawQuery)}`);
      process.exit(1);
    }
    throw error;
  }

  return queryExpr;
}

