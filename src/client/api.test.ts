import { describe, test, expect } from "bun:test";
import { api } from "./api";

describe("Type-safe API Client", () => {
  test("API client can create, read, update, delete documents", async () => {
    // Create - TypeScript enforces required fields (title, content)
    const { data: created, error: createError } = await api.api.documents.post({
      title: "Type Safe Document",
      content: "# TypeScript FTW",
    });

    expect(createError).toBeNull();
    expect(created).toBeDefined();
    expect(created?.title).toBe("Type Safe Document");
    expect(created?.id).toBeDefined();

    const docId = created!.id;

    // Read all
    const { data: allDocs } = await api.api.documents.get();
    expect(Array.isArray(allDocs)).toBe(true);
    expect(allDocs?.some((d) => d.id === docId)).toBe(true);

    // Read one
    const { data: doc } = await api.api.documents({ id: docId }).get();
    expect(doc?.id).toBe(docId);
    expect(doc?.title).toBe("Type Safe Document");

    // Update - TypeScript knows both fields are optional
    const { data: updated } = await api.api.documents({ id: docId }).put({
      content: "# Updated with types!",
    });
    expect(updated?.content).toBe("# Updated with types!");
    expect(updated?.title).toBe("Type Safe Document"); // Title unchanged

    // Delete
    const { data: deleted } = await api.api.documents({ id: docId }).delete();
    expect(deleted?.success).toBe(true);

    // Verify deletion
    const { data: notFound, error } = await api.api.documents({ id: docId }).get();
    expect(notFound).toBeNull();
    expect(error).toBeDefined();
  });
});
