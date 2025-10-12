/**
 * Encode Command
 */

import { encodeCanL3, encodeSmart } from "../../index.js";
import { safeJsonParse } from "../../utils/strings.js";
import { estimateTokens } from "../../utils/metrics.js";
import { safeWriteFile, byteSize, displayStats } from "../utils.js";
import type { Command, CommandContext } from "../types.js";
import type { CanL3Value } from "../../types.js";

export const EncodeCommand: Command = {
  name: "encode",
  description: "Encode JSON to CanL3 format",

  async execute(context: CommandContext): Promise<void> {
    const { file, options, input } = context;

    let CanL3Output: string;
    const jsonData = safeJsonParse(input) as CanL3Value;

    if (options.optimize) {
      // Use optimization
      console.log('ðŸš€ Applying advanced optimization...');

      // Dynamically import optimization module
      const { AdaptiveOptimizer } = await import('../../optimization/index.js');
      const optimizer = new AdaptiveOptimizer();

      const optimizationResult = optimizer.optimize(jsonData as any[]);

      // Build CanL3 with directives
      const directives = optimizationResult.directives.join('\n') + '\n';
      const baseCanL3 = encodeSmart(optimizationResult.optimizedData, {
        delimiter: options.delimiter,
        includeTypes: options.includeTypes,
        version: options.version,
        indent: options.indent,
        singleLinePrimitiveLists: true,
        compactTables: options.compactTables,
        schemaFirst: options.schemaFirst
      });

      CanL3Output = directives + baseCanL3;

      if (options.verbose) {
        console.log('\nðŸ“Š Optimization Analysis:');
        console.log(`Recommended strategies: ${optimizationResult.analysis.recommendedStrategies.join(', ')}`);
        console.log(`Estimated savings: ${optimizationResult.analysis.estimatedSavings}%`);
        console.log(`Applied optimizations: ${optimizationResult.directives.length}`);

        if (optimizationResult.analysis.warnings.length > 0) {
          console.log('\nâš ï¸  Warnings:');
          optimizationResult.analysis.warnings.forEach((warning: any) => {
            console.log(`  â€¢ ${warning}`);
          });
        }

        console.log('\nðŸ”§ Optimization Details:');
        optimizationResult.analysis.appliedOptimizations.forEach((detail: any) => {
          console.log(`  â€¢ ${detail}`);
        });
      }
    } else {
      // Use regular encoding
      const encodeFunc = options.smart ? encodeSmart : encodeCanL3;
      CanL3Output = encodeFunc(jsonData, {
        delimiter: options.delimiter,
        includeTypes: options.includeTypes,
        version: options.version,
        indent: options.indent,
        singleLinePrimitiveLists: true,
        compactTables: options.compactTables,
        schemaFirst: options.schemaFirst
      });
    }

    if (options.out) {
      safeWriteFile(options.out, CanL3Output);
      console.log(`âœ… Encoded to ${options.out}`);
    } else {
      console.log(CanL3Output);
    }

    if (options.stats) {
      const originalBytes = byteSize(JSON.stringify(jsonData));
      const originalTokens = estimateTokens(JSON.stringify(jsonData), options.tokenizer);
      const CanL3Bytes = byteSize(CanL3Output);
      const CanL3Tokens = estimateTokens(CanL3Output, options.tokenizer);
      displayStats(originalBytes, originalTokens, CanL3Bytes, CanL3Tokens, file);
    }
  }
};

