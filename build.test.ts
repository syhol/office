import { describe, expect, test, beforeAll, afterAll } from "bun:test";
import { existsSync, rmSync } from "fs";
import { $ } from "bun";

describe("Build script", () => {
  beforeAll(async () => {
    // Clean up public directory before tests
    if (existsSync("./public")) {
      rmSync("./public", { recursive: true });
    }

    // Run the build script once for all tests
    await $`bun run build.ts`.quiet();
  });

  afterAll(() => {
    // Clean up after all tests
    if (existsSync("./public")) {
      rmSync("./public", { recursive: true });
    }
  });

  test("creates public directory", () => {
    expect(existsSync("./public")).toBe(true);
  });

  test("generates app.js", () => {
    expect(existsSync("./public/app.js")).toBe(true);
  });

  test("generates app.css", () => {
    expect(existsSync("./public/app.css")).toBe(true);
  });

  test("generates source maps", () => {
    expect(existsSync("./public/app.js.map")).toBe(true);
  });

  test("copies index.html to public", () => {
    expect(existsSync("./public/index.html")).toBe(true);
  });

  test("generated index.html contains app.js reference", async () => {
    const html = await Bun.file("./public/index.html").text();
    expect(html).toContain('src="/app.js"');
  });

  test("generated index.html contains app.css reference", async () => {
    const html = await Bun.file("./public/index.html").text();
    expect(html).toContain('href="/app.css"');
  });
});
