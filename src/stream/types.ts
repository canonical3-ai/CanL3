/**
 * Streaming API type definitions
 */

import type { EncodeOptions, DecodeOptions } from '../types.js';
import type { Transform } from 'stream';

/**
 * Streaming encode options
 */
export interface StreamEncodeOptions extends EncodeOptions {
  highWaterMark?: number;  // Buffer size for backpressure (default: 16KB)
}

/**
 * Streaming decode options
 */
export interface StreamDecodeOptions extends DecodeOptions {
  highWaterMark?: number;  // Buffer size for backpressure (default: 16KB)
}

/**
 * Chunk data for streaming
 */
export interface CanL3Chunk {
  type: 'block' | 'primitive' | 'array';
  key?: string;
  data: any;
  complete: boolean;
}

