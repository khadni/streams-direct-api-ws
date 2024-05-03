"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processFullReport = void 0;
const ethers_1 = require("ethers");
const abi = [
    {
        inputs: [
            { internalType: "bytes32[3]", name: "reportContext", type: "bytes32[3]" },
            { internalType: "bytes", name: "reportBlob", type: "bytes" },
            { internalType: "bytes32[]", name: "rawRs", type: "bytes32[]" },
            { internalType: "bytes32[]", name: "rawSs", type: "bytes32[]" },
            { internalType: "bytes32", name: "rawVs", type: "bytes32" },
        ],
        name: "decodeFullReport",
        outputs: [
            { internalType: "bytes32[3]", name: "reportContext", type: "bytes32[3]" },
            { internalType: "bytes", name: "reportBlob", type: "bytes" },
            { internalType: "bytes32[]", name: "rawRs", type: "bytes32[]" },
            { internalType: "bytes32[]", name: "rawSs", type: "bytes32[]" },
            { internalType: "bytes32", name: "rawVs", type: "bytes32" },
        ],
        stateMutability: "view",
        type: "function",
    },
];
const iface = new ethers_1.ethers.utils.Interface(abi);
function decodeFullReport(encodedData) {
    const types = iface.fragments[0].inputs.map((input) => input.type);
    const decoded = ethers_1.ethers.utils.defaultAbiCoder.decode(types, encodedData);
    return {
        reportContext: decoded[0],
        reportBlob: decoded[1],
        rawRs: decoded[2],
        rawSs: decoded[3],
        rawVs: decoded[4],
    };
}
const reportBlobAbi = [
    { type: "bytes32", name: "feedId" },
    { type: "uint32", name: "validFromTimestamp" },
    { type: "uint32", name: "observationsTimestamp" },
    { type: "uint192", name: "nativeFee" },
    { type: "uint192", name: "linkFee" },
    { type: "uint32", name: "expiresAt" },
    { type: "int192", name: "price" },
    { type: "int192", name: "bid" },
    { type: "int192", name: "ask" },
];
function decodeV3Report(reportBlobHex) {
    try {
        const decodedBlob = ethers_1.ethers.utils.defaultAbiCoder.decode(reportBlobAbi.map((item) => item.type), ethers_1.ethers.utils.arrayify(reportBlobHex));
        console.log("Decoded V3 Report Details:");
        console.log("--------------------------");
        console.log(`Feed ID: ${decodedBlob[0]}`);
        console.log(`Valid From Timestamp: ${decodedBlob[1].toString()}`);
        console.log(`Observations Timestamp: ${decodedBlob[2].toString()}`);
        console.log(`Native Fee: ${ethers_1.ethers.utils.formatUnits(decodedBlob[3], "wei")}`);
        console.log(`Link Fee: ${ethers_1.ethers.utils.formatUnits(decodedBlob[4], "wei")}`);
        console.log(`Expires At: ${decodedBlob[5].toString()}`);
        console.log(`Price: ${decodedBlob[6].toString()}`);
        console.log(`Bid: ${decodedBlob[7].toString()}`);
        console.log(`Ask: ${decodedBlob[8].toString()}`);
    }
    catch (error) {
        console.error("Failed to decode report:", error);
    }
}
function processFullReport(hexData) {
    const bytesData = ethers_1.ethers.utils.arrayify(hexData);
    try {
        const decodedReport = decodeFullReport(bytesData);
        if (decodedReport.reportBlob) {
            decodeV3Report(decodedReport.reportBlob);
        }
    }
    catch (error) {
        console.error("Failed to decode report:", error);
    }
}
exports.processFullReport = processFullReport;
