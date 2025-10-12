/**
 * CanL3 Browser Build - Core Features Only
 * 
 * Includes: encode, decode, query, navigation (browser-safe)
 * Excludes: FileEditor, REPL, Stream (Node.js-specific)
 */

export type { EncodeOptions, DecodeOptions, CanL3Value, CanL3Object, CanL3Array } from "./types.js";
export { encodeCanL3, decodeCanL3, encodeSmart } from "./index.js";
export { CanL3DocumentBrowser as CanL3Document } from './document-browser.js';
export type { DocumentStats } from './document-browser.js';


