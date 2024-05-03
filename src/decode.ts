import { processFullReport } from "./internal/decoder";

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error("Usage: ts-node decodeFullReport.ts <hexData>");
  process.exit(1);
}

const hexData = args[0];

processFullReport(hexData);
