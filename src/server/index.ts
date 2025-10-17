const server = Bun.serve({
  port: 3001,

  fetch(req, server) {
    const url = new URL(req.url);

    // Dev-only: Trigger reload for all connected clients
    if (url.pathname === "/_dev/reload" && req.method === "POST") {
      server.publish("document-updates", JSON.stringify({ type: "reload" }));
      return new Response("OK");
    }

    // WebSocket upgrade for real-time collaboration
    if (url.pathname === "/ws") {
      if (server.upgrade(req)) {
        return; // Connection upgraded to WebSocket
      }
      return new Response("WebSocket upgrade failed", { status: 400 });
    }

    // Serve static files from public directory
    const filePath = url.pathname === "/" ? "/index.html" : url.pathname;
    const file = Bun.file(`./public${filePath}`);

    return new Response(file);
  },

  websocket: {
    open(ws) {
      console.log("Client connected");
      ws.subscribe("document-updates");
    },

    message(_ws, message) {
      console.log("Received message:", message);

      // Broadcast to all connected clients
      server.publish("document-updates", message);
    },

    close(_ws) {
      console.log("Client disconnected");
    },
  },
});

console.log(`🚀 Office server running at http://localhost:${server.port}`);
console.log(`📝 Open http://localhost:${server.port} in your browser`);
