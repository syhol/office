# Architecture

This document describes the technical architecture and design decisions for Office.

## System Overview

Office is a client-server application with real-time capabilities:

```
┌─────────────┐         WebSocket          ┌─────────────┐
│   Browser   │ ◄────────────────────────► │  Bun Server │
│             │                            │             │
│ React App   │         HTTP/Static        │ WebSocket   │
│ MDXEditor   │ ◄────────────────────────► │ Handler     │
└─────────────┘                            └─────────────┘
                                                   │
                                                   ▼
                                           ┌─────────────┐
                                           │  Storage    │
                                           │  (Future)   │
                                           └─────────────┘
```

## Tech Stack Decisions

### Why Bun?

**Chosen over Node.js and Deno**

Rationale:

- **Performance**: 3x faster startup, better runtime performance
- **Built-in tooling**: Bundler, test runner, package manager included
- **npm compatibility**: Can use entire npm ecosystem
- **Native TypeScript**: No tsconfig setup required
- **Built-in SQLite**: Perfect for future document persistence
- **Native WebSockets**: No need for external libraries

Trade-offs:

- Newer ecosystem (less mature than Node)
- Smaller community
- Some npm packages may have edge case issues

### Why MDXEditor?

**Chosen over building custom editor or using alternatives like TipTap, ProseMirror, Slate**

Rationale:

- **Feature complete**: Toolbar, formatting, tables, code blocks all included
- **Markdown-native**: Uses standard markdown (not proprietary format)
- **React-based**: Fits our stack perfectly
- **Extensible**: Plugin system for custom features
- **Active maintenance**: Regular updates and bug fixes
- **Good DX**: Easy to integrate and configure

Trade-offs:

- Larger bundle size than bare editors
- Less control over internals
- May need adapter layer for collaboration features

### Why Bun Bundler over Vite?

**Chosen to use Bun's native bundling**

Rationale:

- **Simplicity**: One tool instead of two
- **Performance**: Faster builds
- **Consistency**: Same runtime and build tool
- **Less config**: Works out of the box

Trade-offs:

- Less mature plugin ecosystem
- Fewer optimization options
- Less documentation/examples

## Project Structure

```
office/
├── .claude/              # Claude Code context
├── src/
│   ├── client/          # Frontend React app
│   │   ├── App.tsx      # Main app component
│   │   ├── index.tsx    # React entry point
│   │   └── index.html   # HTML template
│   ├── server/          # Bun server
│   │   └── index.ts     # HTTP + WebSocket server
│   └── shared/          # Shared types/utils (future)
├── public/              # Built assets (gitignored)
├── docs/                # Documentation
├── tests/               # Tests (future)
├── build.ts             # Build script
└── package.json
```

### Module Organization

- **Client**: React components, all UI logic
- **Server**: HTTP routes, WebSocket handling, future DB logic
- **Shared**: Types, utilities, constants shared between client/server

## Build Pipeline

```
Source Files                    Build Process                Output
─────────────────              ──────────────────           ──────────

src/client/index.tsx    ──►    Bun.build({              ──► public/app.js
src/client/App.tsx             entrypoints,                 public/app.css
:> [!WARNING]
> @mdxeditor/editor              outdir: 'public',            public/app.js.map
react, react-dom               target: 'browser'
                               })

src/client/index.html   ──►    Copy to public/          ──► public/index.html
```

**Key build settings:**

- `target: 'browser'` - Optimizes for browser environment
- `sourcemap: 'external'` - Generates .map files for debugging
- `naming: 'app.[ext]'` - Consistent output naming
- Automatic CSS extraction from node_modules

## Server Architecture

### HTTP Server

```typescript
Bun.serve({
  port: 3001,
  fetch(req, server) {
    // Route: WebSocket upgrade
    if (pathname === "/ws") → server.upgrade(req)

    // Route: Static files
    else → Bun.file(`./public${filePath}`)
  }
})
```

**Design decisions:**

- Single `fetch` handler for all routes
- Static file serving via `Bun.file()` (optimized by Bun)
- Generic file serving (any file in public/ is accessible)
- Port 3001 to avoid common dev port conflicts

### WebSocket Architecture

```typescript
websocket: {
  open(ws) {
    ws.subscribe("document-updates")
  },

  message(ws, message) {
    server.publish("document-updates", message)
  }
}
```

**Current implementation:**

- Pub/sub pattern using Bun's native channels
- All clients subscribe to "document-updates" channel
- Messages are broadcast to all subscribers
- No message filtering or user identification yet

**Future needs:**

- User authentication/identification
- Document-specific channels
- Message validation
- CRDT/OT integration for proper conflict resolution

## Data Flow

### Current (Single User)

```
User types in MDXEditor
    ↓
onChange callback fires
    ↓
State updates in React
    ↓
WebSocket sends update (logged, not processed)
    ↓
Server broadcasts to all clients (no action yet)
```

### Future (Multi-User with CRDT)

```
User types in MDXEditor
    ↓
Generate CRDT operation
    ↓
Apply operation locally (optimistic update)
    ↓
Send operation via WebSocket
    ↓
Server broadcasts to other clients
    ↓
Other clients apply operation to their CRDT state
    ↓
CRDT syncs with MDXEditor
```

## Security Considerations

**Current state:** None implemented (MVP/prototype)

**Future requirements:**

- Input sanitization for markdown content
- WebSocket authentication
- Rate limiting on WebSocket messages
- CORS configuration
- CSP headers for XSS protection
- File upload restrictions (for images)

## Performance Considerations

### Client-Side

- **Bundle size**: ~5.4MB JS, 55KB CSS (uncompressed)
  - Could be optimized with code splitting
  - MDXEditor is the bulk of the bundle
- **Rendering**: React with MDXEditor (performance is good for single document)
- **WebSocket**: Minimal overhead, binary protocol available

### Server-Side

- **Static files**: Served via `Bun.file()` (highly optimized)
- **WebSocket**: Bun's native implementation (C++ under the hood)
- **Memory**: Currently all in-memory, will need optimization for many documents

### Future Optimizations

- Lazy load MDXEditor plugins
- Code splitting for multi-page app
- WebSocket message compression
- Document pagination for large files
- Caching strategy for static assets

## Scalability Considerations

**Current limitations:**

- Single server instance
- In-memory state only
- No load balancing
- No horizontal scaling

**Future architecture for scale:**

- Redis for pub/sub across multiple server instances
- Database for document persistence
- CDN for static assets
- WebSocket connection pooling
- Document sharding by ID

## Development Workflow

### Build Process

1. TypeScript files in `src/client/`
2. Bun bundles to `public/`
3. Server serves from `public/`

### Local Development

- Manual rebuild required (no watch mode yet)
- Server restart required for server changes
- Client changes need rebuild

### Future Improvements

- File watching with auto-rebuild
- Hot module replacement
- Dev/prod environment configs
- Docker containerization

## Testing Strategy (Future)

**Planned:**

- Unit tests: Bun's built-in test runner
- Integration tests: WebSocket communication
- E2E tests: Playwright or similar
- Performance tests: Load testing WebSocket with many clients

## Browser Compatibility

**Target:** Modern browsers with ES2020+ support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions

**Not supported:**

- IE11 or older browsers
- Browsers without WebSocket support

## Dependencies

### Production

- `react` (19.2.0): UI framework
- `react-dom` (19.2.0): React renderer
- `@mdxeditor/editor` (3.47.0): Markdown editor

### Development

- `@types/bun`: Bun TypeScript types
- `@types/react`: React TypeScript types
- `@types/react-dom`: React DOM TypeScript types

**Philosophy:** Minimal dependencies, leverage Bun built-ins where possible

---

_Last updated: 2025-10-17_
