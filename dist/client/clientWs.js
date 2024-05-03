"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectWebSocket = void 0;
const ws_1 = __importDefault(require("ws"));
const crypto_1 = require("crypto");
require("dotenv").config();
const pingInterval = 5000; // 5 seconds
const pongTimeout = 10000; // 10 seconds
function generateHMAC(method, url, body, clientId, userSecret) {
    const bodyHash = (0, crypto_1.createHash)("sha256")
        .update(body || "")
        .digest("hex");
    const timestamp = Date.now();
    const pathWithQuery = new URL(url).pathname + new URL(url).search;
    const hmacBaseString = `${method} ${pathWithQuery} ${bodyHash} ${clientId} ${timestamp}`;
    console.log("Generating HMAC with the following string:", hmacBaseString);
    const hmac = (0, crypto_1.createHmac)("sha256", userSecret);
    hmac.update(hmacBaseString);
    return hmac.digest("hex");
}
function generateAuthHeaders(method, url, clientId, userSecret) {
    const hmacSignature = generateHMAC(method, url, "", clientId, userSecret);
    const timestamp = Date.now();
    return {
        Authorization: clientId,
        "X-Authorization-Timestamp": timestamp.toString(),
        "X-Authorization-Signature-SHA256": hmacSignature,
    };
}
const wsPath = "/api/v1/ws";
function connectWebSocket(feedIds) {
    let baseUrl = process.env.BASE_URL || "";
    const protocol = "wss://";
    const completeBaseUrl = `${protocol}${baseUrl}`;
    const clientId = process.env.CLIENT_ID || "";
    const userSecret = process.env.CLIENT_SECRET || "";
    const params = new URLSearchParams({ feedIDs: feedIds.join(",") });
    const wsUrl = `${completeBaseUrl}${wsPath}?${params.toString()}`;
    const headers = generateAuthHeaders("GET", wsUrl, clientId, userSecret);
    const ws = new ws_1.default(wsUrl, {
        headers: { ...headers },
    });
    if (!baseUrl || !clientId || !userSecret) {
        throw new Error("Missing required environment variables");
    }
    ws.on("open", () => {
        console.log("WebSocket connection opened.");
        startPingPong(ws);
    });
    ws.on("message", (data) => {
        console.log("Received message:", data.toString());
    });
    ws.on("close", () => {
        console.log("WebSocket connection closed.");
    });
    ws.on("error", (error) => {
        console.error("WebSocket error:", error);
    });
}
exports.connectWebSocket = connectWebSocket;
function startPingPong(ws) {
    let pongReceived = true;
    let pongTimeoutId;
    const pingIntervalId = setInterval(() => {
        if (ws.readyState === ws_1.default.OPEN) {
            if (!pongReceived) {
                console.log("Pong not received within the expected time. Closing connection.");
                ws.close();
                clearInterval(pingIntervalId);
                clearTimeout(pongTimeoutId);
                return;
            }
            pongReceived = false;
            console.log("Sending ping...");
            ws.ping();
            clearTimeout(pongTimeoutId);
            pongTimeoutId = setTimeout(() => {
                if (!pongReceived) {
                    console.log("Pong timeout reached without receiving pong. Closing connection.");
                    ws.close();
                    clearInterval(pingIntervalId);
                }
            }, pongTimeout);
        }
        else {
            clearInterval(pingIntervalId);
            clearTimeout(pongTimeoutId);
        }
    }, pingInterval);
    ws.on("pong", () => {
        console.log("Received pong...");
        pongReceived = true;
    });
    ws.on("ping", () => ws.pong());
}
