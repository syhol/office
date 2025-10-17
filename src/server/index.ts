import { SQLiteDocumentRepository } from "./repositories/SQLiteDocumentRepository";

// Initialize repository
const documentRepo = new SQLiteDocumentRepository();

const server = Bun.serve({
  port: 3001,

  async fetch(req, server) {
    const url = new URL(req.url);

    // Dev-only: Trigger reload for all connected clients
    if (url.pathname === "/_dev/reload" && req.method === "POST") {
      server.publish("document-updates", JSON.stringify({ type: "reload" }));
      return new Response("OK");
    }

    // API: List all documents
    if (url.pathname === "/api/documents" && req.method === "GET") {
      const documents = await documentRepo.findAll();
      return new Response(JSON.stringify(documents), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // API: Get single document
    if (url.pathname.match(/^\/api\/documents\/[^/]+$/) && req.method === "GET") {
      const id = url.pathname.split("/").pop()!;
      const document = await documentRepo.findById(id);

      if (!document) {
        return new Response(JSON.stringify({ error: "Document not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify(document), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // API: Create document
    if (url.pathname === "/api/documents" && req.method === "POST") {
      try {
        const body = await req.json();
        const document = await documentRepo.create(body);
        return new Response(JSON.stringify(document), {
          status: 201,
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: "Invalid JSON" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // API: Update document
    if (url.pathname.match(/^\/api\/documents\/[^/]+$/) && req.method === "PUT") {
      try {
        const id = url.pathname.split("/").pop()!;
        const body = await req.json();
        const document = await documentRepo.update(id, body);

        if (!document) {
          return new Response(JSON.stringify({ error: "Document not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify(document), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: "Invalid JSON" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // API: Delete document
    if (url.pathname.match(/^\/api\/documents\/[^/]+$/) && req.method === "DELETE") {
      const id = url.pathname.split("/").pop()!;
      const deleted = await documentRepo.delete(id);

      if (!deleted) {
        return new Response(JSON.stringify({ error: "Document not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
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
