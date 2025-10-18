#!/usr/bin/env bun
// Build script for bundling the client app with Bun

const result = await Bun.build({
  entrypoints: ["./src/client/index.tsx"],
  outdir: "./public",
  target: "browser",
  minify: process.env.NODE_ENV === "production",
  sourcemap: "external",
  naming: "app.[ext]",
});

if (!result.success) {
  console.error("Build failed");
  for (const log of result.logs) {
    console.error(log);
  }
  process.exit(1);
}

// Copy HTML and favicon to public directory
await Bun.write("./public/index.html", await Bun.file("./src/client/index.html").text());
await Bun.write("./public/favicon.svg", await Bun.file("./src/client/favicon.svg").text());

console.log("✓ Build completed successfully");
console.log(`✓ Generated ${result.outputs.length} files`);

export {};
