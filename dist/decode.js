"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decoder_1 = require("./internal/decoder");
const args = process.argv.slice(2);
if (args.length === 0) {
    console.error("Usage: ts-node decodeFullReport.ts <hexData>");
    process.exit(1);
}
const hexData = args[0];
(0, decoder_1.processFullReport)(hexData);
