"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clientWs_1 = require("./client/clientWs");
function main() {
    const feedIds = process.argv.slice(2);
    if (feedIds.length < 1) {
        console.error(`Usage: node dist/main.js <feedID1> <feedID2> ...`);
        process.exit(1);
    }
    console.log(`Connecting to WebSocket with feed IDs: ${feedIds.join(", ")}`);
    try {
        (0, clientWs_1.connectWebSocket)(feedIds);
    }
    catch (error) {
        console.error(`Error connecting and listening: ${error}`);
        process.exit(1);
    }
}
main();
