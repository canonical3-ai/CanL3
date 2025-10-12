/**
 * Simple Enhanced Stats Module
 */

import { encodeCanL3, decodeCanL3 } from "../index.js";
import { safeJsonParse } from "../utils/strings.js";
import { estimateTokens } from "../utils/metrics.js";
import { byteSize } from "./utils.js";
import * as fs from "fs";
import type { CanL3Value } from "../types.js";

export interface FileStats {
  filename: string;
  originalBytes: number;
  originalTokens: number;
  CanL3Bytes: number;
  CanL3Tokens: number;
  byteSavings: string;
  tokenSavings: string;
  compressionRatio: number;
  fileType: 'json' | 'CanL3';
  processingTime: number;
}

export class EnhancedStats {
  // ðŸ“Š Simple file analysis
  async analyzeFile(filePath: string, options: any = {}): Promise<FileStats> {
    const startTime = Date.now();
    const filename = filePath.split('/').pop() || filePath;

    console.log(`ðŸ“– Reading ${filename}...`);

    const content = fs.readFileSync(filePath, 'utf8');
    const originalBytes = byteSize(content);

    let data: any;
    let fileType: 'json' | 'CanL3';

    if (filePath.endsWith('.json')) {
      data = safeJsonParse(content);
      fileType = 'json';
    } else {
      data = decodeCanL3(content, { delimiter: undefined });
      fileType = 'CanL3';
    }

    console.log(`âš™ï¸  Processing data...`);

    // Calculate original tokens
    const originalTokens = estimateTokens(
      fileType === 'json' ? content : JSON.stringify(data),
      options.tokenizer
    );

    // Encode to CanL3 and calculate compression
    const CanL3Output = encodeCanL3(data, { delimiter: undefined });
    const CanL3Bytes = byteSize(CanL3Output);
    const CanL3Tokens = estimateTokens(CanL3Output, options.tokenizer);

    console.log(`âœ… Analysis complete!`);

    const processingTime = Date.now() - startTime;
    const byteSavings = originalBytes > 0
      ? ((originalBytes - CanL3Bytes) / originalBytes * 100).toFixed(1)
      : '0.0';
    const tokenSavings = originalTokens > 0
      ? ((originalTokens - CanL3Tokens) / originalTokens * 100).toFixed(1)
      : '0.0';
    const compressionRatio = originalBytes > 0 ? CanL3Bytes / originalBytes : 0;

    return {
      filename,
      originalBytes,
      originalTokens,
      CanL3Bytes,
      CanL3Tokens,
      byteSavings,
      tokenSavings,
      compressionRatio,
      fileType,
      processingTime
    };
  }
}

