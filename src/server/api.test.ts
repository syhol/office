import { describe, test, expect, beforeAll, afterAll } from "bun:test";

const BASE_URL = "http://localhost:3001";
let testDocId: string;

describe("Document API", () => {
  test("GET /api/documents - list all documents", async () => {
    const response = await fetch(`${BASE_URL}/api/documents`);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test("POST /api/documents - create document", async () => {
    const response = await fetch(`${BASE_URL}/api/documents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Test Document",
        content: "# Test\n\nThis is a test document.",
      }),
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.id).toBeDefined();
    expect(data.title).toBe("Test Document");
    expect(data.content).toBe("# Test\n\nThis is a test document.");
    testDocId = data.id;
  });

  test("GET /api/documents/:id - get single document", async () => {
    const response = await fetch(`${BASE_URL}/api/documents/${testDocId}`);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.id).toBe(testDocId);
    expect(data.title).toBe("Test Document");
  });

  test("PUT /api/documents/:id - update document", async () => {
    const response = await fetch(`${BASE_URL}/api/documents/${testDocId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: "# Updated\n\nThis content has been updated!",
      }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.id).toBe(testDocId);
    expect(data.title).toBe("Test Document");
    expect(data.content).toBe("# Updated\n\nThis content has been updated!");
  });

  test("GET /api/documents/:id - verify update", async () => {
    const response = await fetch(`${BASE_URL}/api/documents/${testDocId}`);
    const data = await response.json();
    expect(data.content).toBe("# Updated\n\nThis content has been updated!");
  });

  test("DELETE /api/documents/:id - delete document", async () => {
    const response = await fetch(`${BASE_URL}/api/documents/${testDocId}`, {
      method: "DELETE",
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
  });

  test("GET /api/documents/:id - verify deletion", async () => {
    const response = await fetch(`${BASE_URL}/api/documents/${testDocId}`);
    expect(response.status).toBe(404);
  });

  test("GET /api/documents/:id - 404 for non-existent document", async () => {
    const response = await fetch(`${BASE_URL}/api/documents/nonexistent`);
    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe("Document not found");
  });

  test("PUT /api/documents/:id - 404 for non-existent document", async () => {
    const response = await fetch(`${BASE_URL}/api/documents/nonexistent`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Updated" }),
    });
    expect(response.status).toBe(404);
  });

  test("DELETE /api/documents/:id - 404 for non-existent document", async () => {
    const response = await fetch(`${BASE_URL}/api/documents/nonexistent`, {
      method: "DELETE",
    });
    expect(response.status).toBe(404);
  });
});
