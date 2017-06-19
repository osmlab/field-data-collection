import websocket from "websocket-stream";

export default function createWebsocket(opts) {
  opts = opts || {};
  const url = opts.url || "ws://10.0.2.2:3131";
  return websocket(url);
}
