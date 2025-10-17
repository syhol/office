// Development server with auto-rebuild and hot reload
import { watch } from "fs";
import { spawn } from "bun";

let serverProcess: ReturnType<typeof spawn> | null = null;

// Build function
async function build() {
  console.log("🔨 Building client...");
  const buildProcess = spawn(["bun", "run", "build.ts"], {
    stdout: "inherit",
    stderr: "inherit",
  });
  await buildProcess.exited;
  console.log("✅ Build complete - triggering browser reload\n");

  // Notify all connected clients to reload
  if (serverProcess) {
    try {
      await fetch("http://localhost:3001/_dev/reload", { method: "POST" });
    } catch {
      // Server might not be ready yet, ignore
    }
  }
}

// Start server function
function startServer() {
  if (serverProcess) {
    console.log("🔄 Restarting server...");
    serverProcess.kill();
  }

  console.log("🚀 Starting server with hot reload...");
  serverProcess = spawn(["bun", "--hot", "src/server/index.ts"], {
    stdout: "inherit",
    stderr: "inherit",
  });
}

// Initial build and start
console.log("🏗️  Initial build and server start...\n");
await build();
startServer();

// Watch client files for auto-rebuild
const clientWatcher = watch(
  "./src/client",
  { recursive: true },
  async (event, filename) => {
    if (filename) {
      console.log(`\n📝 Client file changed: ${filename}`);
      await build();
    }
  },
);

// Watch build script
const buildWatcher = watch("./build.ts", async (event, filename) => {
  if (filename) {
    console.log("\n🔨 Build script changed");
    await build();
  }
});

console.log("\n👀 Watching for changes...");
console.log("   - src/client/ → auto-rebuild (refresh browser to see changes)");
console.log("   - src/server/ → hot reload (automatic)");
console.log("   - build.ts → auto-rebuild");
console.log("\nPress Ctrl+C to stop\n");

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n👋 Shutting down...");
  clientWatcher.close();
  buildWatcher.close();
  if (serverProcess) {
    serverProcess.kill();
  }
  process.exit(0);
});
