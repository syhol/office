import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import { SQLiteDocumentRepository } from "./repositories/SQLiteDocumentRepository";

// Initialize repository
const documentRepo = new SQLiteDocumentRepository();

const app = new Elysia()
  .get("/api/documents", async () => {
    const documents = await documentRepo.findAll();
    return documents;
  })
  .get("/api/documents/:id", async ({ params, set }) => {
    const document = await documentRepo.findById(params.id);

    if (!document) {
      set.status = 404;
      return { error: "Document not found" };
    }

    return document;
  })
  .post("/api/documents", async ({ body, set }) => {
    const document = await documentRepo.create(body as any);
    set.status = 201;
    return document;
  })
  .put("/api/documents/:id", async ({ params, body, set }) => {
    const document = await documentRepo.update(params.id, body as any);

    if (!document) {
      set.status = 404;
      return { error: "Document not found" };
    }

    return document;
  })
  .delete("/api/documents/:id", async ({ params, set }) => {
    const deleted = await documentRepo.delete(params.id);

    if (!deleted) {
      set.status = 404;
      return { error: "Document not found" };
    }

    return { success: true };
  })
  .ws("/ws", {
    open(ws) {
      console.log("Client connected");
      ws.subscribe("document-updates");
    },
    message(ws, message) {
      console.log("Received message:", message);
      ws.publish("document-updates", message);
    },
    close(_ws) {
      console.log("Client disconnected");
    },
  })
  .post("/_dev/reload", ({ server }) => {
    server?.publish("document-updates", JSON.stringify({ type: "reload" }));
    return "OK";
  })
  .get("/*", async ({ path }) => {
    const filePath = path === "/" ? "/index.html" : path;
    const file = Bun.file(`./public${filePath}`);

    if (await file.exists()) {
      return file;
    }

    return new Response("Not Found", { status: 404 });
  })
  .listen(3001);

console.log(`🚀 Office server running at http://localhost:${app.server?.port}`);
console.log(`📝 Open http://localhost:${app.server?.port} in your browser`);
