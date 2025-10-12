/**
 * Decode Command
 */

import { decodeCanL3 } from "../../index.js";
import { safeWriteFile } from "../utils.js";
import type { Command, CommandContext } from "../types.js";

export const DecodeCommand: Command = {
  name: "decode",
  description: "Decode CanL3 to JSON format",

  async execute(context: CommandContext): Promise<void> {
    const { options, input } = context;

    const jsonData = decodeCanL3(input, {
      delimiter: options.delimiter,
      strict: options.strict
    });

    const jsonOutput = JSON.stringify(jsonData, null, 2);

    if (options.out) {
      safeWriteFile(options.out, jsonOutput);
      console.log(`âœ… Decoded to ${options.out}`);
    } else {
      console.log(jsonOutput);
    }
  }
};

