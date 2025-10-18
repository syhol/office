import { describe, test, expect } from "bun:test";

const BASE_URL = "http://localhost:3001";

describe("Static File Serving", () => {
  test("GET / - serves index.html", async () => {
    const response = await fetch(`${BASE_URL}/`);
    expect(response.status).toBe(200);
    const text = await response.text();
    expect(text).toContain("<!DOCTYPE html>");
    expect(text).toContain("Office - Collaborative Document Editor");
  });

  test("GET /index.html - serves index.html", async () => {
    const response = await fetch(`${BASE_URL}/index.html`);
    expect(response.status).toBe(200);
    const text = await response.text();
    expect(text).toContain("<!DOCTYPE html>");
  });

  test("GET /app.js - serves bundled JavaScript", async () => {
    const response = await fetch(`${BASE_URL}/app.js`);
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("javascript");
  });

  test("GET /app.css - serves bundled CSS", async () => {
    const response = await fetch(`${BASE_URL}/app.css`);
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("css");
  });

  test("GET /favicon.svg - serves favicon", async () => {
    const response = await fetch(`${BASE_URL}/favicon.svg`);
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("svg");
  });

  test("GET /nonexistent - returns 404", async () => {
    const response = await fetch(`${BASE_URL}/nonexistent.html`);
    expect(response.status).toBe(404);
  });
});
