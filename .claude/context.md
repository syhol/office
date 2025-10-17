# Office Project Context

## Quick Summary

FOSS Google Docs alternative using Markdown. Built with Bun, React, and MDXEditor.

## Tech Stack

- **Runtime**: Bun v1.3.0 (managed via mise)
- **Frontend**: React 19 + TypeScript
- **Editor**: MDXEditor v3.47.0
- **Server**: Bun HTTP + WebSocket (port 3001)
- **Build**: Bun's native bundler

## Key Commands

```bash
bun install        # Install dependencies
bun run build      # Build to public/
bun run dev        # Build + start server
bun start          # Production build + start
```

## Current State

**Working:**

- ✅ MDXEditor with full toolbar
- ✅ WebSocket connection (infrastructure only)
- ✅ Build pipeline (TypeScript → public/)
- ✅ Static file serving

**Not Yet Implemented:**

- ❌ Real-time collaboration (WebSocket connected but no sync logic)
- ❌ Document persistence (memory only)
- ❌ Hot reload
- ❌ Multiple documents
- ❌ Authentication

## Important Notes

- Server runs on **port 3001** (not 3000)
- Build outputs to `public/` (gitignored)
- WebSocket endpoint: `ws://localhost:3001/ws`
- Using Bun primitives instead of Vite

## Next Priorities

1. Document persistence (Bun SQLite)
2. Real-time collaboration (Yjs/CRDT)
3. Hot reload (Bun --watch)
4. Linting and formatting (biomejs)

See `docs/roadmap.md` for full details.
