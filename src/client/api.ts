import { treaty } from "@elysiajs/eden";
import type { App } from "../server/index";

// Create type-safe API client
export const api = treaty<App>("localhost:3001");
