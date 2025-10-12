/**
 * Format Command
 */

import { encodeCanL3, decodeCanL3 } from "../../index.js";
import { safeWriteFile } from "../utils.js";
import type { Command, CommandContext } from "../types.js";

export const FormatCommand: Command = {
  name: "format",
  description: "Format CanL3 file with proper indentation and delimiters",

  async execute(context: CommandContext): Promise<void> {
    const { file, options, input } = context;

    if (!file.endsWith('.CanL3')) {
      console.error("âŒ Error: Format command requires a .CanL3 file");
      process.exit(1);
    }

    // Parse the CanL3 file
    const jsonData = decodeCanL3(input, {
      delimiter: options.delimiter,
      strict: options.strict
    });

    // Re-encode with pretty formatting
    const formattedOutput = encodeCanL3(jsonData, {
      delimiter: options.delimiter,
      includeTypes: options.includeTypes,
      version: options.version,
      indent: options.indent || 2,
      singleLinePrimitiveLists: true,
      prettyDelimiters: options.pretty
    });

    if (options.out) {
      safeWriteFile(options.out, formattedOutput);
      console.log(`âœ… Formatted to ${options.out}`);
    } else {
      console.log(formattedOutput);
    }
  }
};

