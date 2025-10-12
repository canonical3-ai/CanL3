/**
 * Enhanced Stats Command
 */

import { encodeCanL3, decodeCanL3 } from "../../index.js";
import { safeJsonParse } from "../../utils/strings.js";
import { estimateTokens } from "../../utils/metrics.js";
import { byteSize, displayStats } from "../utils.js";
import { SimpleInteractiveStats } from "../simple-interactive.js";
import type { Command, CommandContext } from "../types.js";
import type { CanL3Value } from "../../types.js";

export const StatsCommand: Command = {
  name: "stats",
  description: "Display compression statistics for JSON or CanL3 files (supports interactive mode)",

  async execute(context: CommandContext): Promise<void> {
    const { file, options, input } = context;

    // ðŸš€ Check if interactive mode is enabled
    if (options.interactive || process.argv.includes('--interactive') || process.argv.includes('-i')) {
      const interactiveStats = new SimpleInteractiveStats();
      await interactiveStats.start(file, {
        tokenizer: options.tokenizer,
        compareMode: options.compare,
        verbose: options.verbose
      });
      interactiveStats.close();
      return;
    }

    // ðŸ“Š Traditional stats mode
    if (file.endsWith('.json')) {
      // JSON file - encode and compare
      const jsonData = safeJsonParse(input) as CanL3Value;
      const originalBytes = byteSize(input);
      const originalTokens = estimateTokens(input, options.tokenizer);

      const CanL3Output = encodeCanL3(jsonData, { delimiter: options.delimiter });
      const CanL3Bytes = byteSize(CanL3Output);
      const CanL3Tokens = estimateTokens(CanL3Output, options.tokenizer);

      displayStats(originalBytes, originalTokens, CanL3Bytes, CanL3Tokens, file);
    } else if (file.endsWith('.CanL3')) {
      // CanL3 file - decode and compare
      const jsonData = decodeCanL3(input, { delimiter: options.delimiter });
      const jsonOutput = JSON.stringify(jsonData);

      const CanL3Bytes = byteSize(input);
      const CanL3Tokens = estimateTokens(input, options.tokenizer);
      const originalBytes = byteSize(jsonOutput);
      const originalTokens = estimateTokens(jsonOutput, options.tokenizer);

      displayStats(originalBytes, originalTokens, CanL3Bytes, CanL3Tokens, file);
    } else {
      console.error("âŒ Error: File must be .json or .CanL3");
      process.exit(1);
    }

    // ðŸ’¡ Suggest interactive mode
    console.log(`\nðŸ’¡ Try interactive mode!`);
    console.log(`   Run: CanL3 stats ${file} --interactive`);
    console.log(`   Or: CanL3 stats ${file} -i`);
  }
};

