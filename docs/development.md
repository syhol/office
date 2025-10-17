# Development Guide

This guide covers everything you need to know to develop Office.

## Getting Started

### Prerequisites

- **Bun** v1.3.0 or higher
- **Git** for version control
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Recommended Tools

- **mise**: Version manager (handles Bun version automatically)
- **VS Code** or any editor with TypeScript support
- **React DevTools** browser extension

### Initial Setup

```bash
# Clone the repository
git clone <repo-url>
cd office

# If using mise, it will auto-install Bun 1.3.0
# Otherwise, install Bun manually: curl -fsSL https://bun.sh/install | bash

# Install dependencies
bun install
```

## Development Workflow

### Running the Dev Server

```bash
# Build and start server in one command
bun run dev

# Or run steps separately:
bun run build          # Build frontend to public/
bun run src/server/index.ts  # Start server
```

Server will be available at: **http://localhost:3001**

WebSocket endpoint: **ws://localhost:3001/ws**

### Making Changes

#### Frontend Changes

1. Edit files in `src/client/`
2. Run `bun run build` to rebuild
3. Refresh browser to see changes

**Note:** No hot reload yet - manual rebuild required

#### Server Changes

1. Edit files in `src/server/`
2. Stop the server (Ctrl+C)
3. Restart with `bun run src/server/index.ts`

### File Structure

```
src/
├── client/
│   ├── App.tsx          # Main React component with MDXEditor
│   ├── index.tsx        # React entry point (renders App)
│   └── index.html       # HTML template (links to app.js, app.css)
│
├── server/
│   └── index.ts         # Bun server (HTTP + WebSocket)
│
└── shared/              # (Future) Shared code between client/server
```

## Scripts Reference

### `bun install`
Installs all dependencies from package.json

### `bun run build`
Bundles the React app to `public/` directory:
- `public/app.js` - Bundled JavaScript
- `public/app.css` - Extracted CSS from MDXEditor
- `public/app.js.map` - Source maps
- `public/index.html` - Copied HTML template

### `bun run dev`
Builds the frontend and starts the development server.
Equivalent to: `bun run build && bun run src/server/index.ts`

### `bun start`
Production mode - builds and starts server.
Currently same as dev mode, but sets up for future optimizations.

### `bun test`
Runs tests with Bun's built-in test runner.
(No tests implemented yet)

## Build System

### How the Build Works

The `build.ts` script uses Bun's native bundler:

```typescript
await Bun.build({
  entrypoints: ['./src/client/index.tsx'],
  outdir: './public',
  target: 'browser',
  minify: process.env.NODE_ENV === 'production',
  sourcemap: 'external',
  naming: 'app.[ext]',
})
```

**What happens:**
1. Starts from `src/client/index.tsx`
2. Follows all imports (React, MDXEditor, etc.)
3. Bundles everything into `public/app.js`
4. Extracts CSS to `public/app.css`
5. Generates source maps to `public/app.js.map`
6. Copies `index.html` to `public/index.html`

### Build Output

The `public/` directory is gitignored and contains:

```
public/
├── app.js          # ~5.4MB bundled JavaScript (uncompressed)
├── app.css         # ~55KB MDXEditor styles
├── app.js.map      # ~11MB source maps
└── index.html      # HTML entry point
```

## Code Style

### TypeScript

- Use TypeScript for all new files
- Enable strict mode (future)
- Prefer interfaces over types for object shapes
- Use type inference where possible

### React

- Functional components with hooks
- Use const for component declarations
- Props should be typed with interfaces
- Prefer named exports for components

### Formatting

Currently no formatter configured. Future setup:
- Use Bun's built-in formatter (when stable)
- Or integrate Prettier

## Git Workflow

### Commit Messages

Use conventional commit format:

```
<type>: <subject>

<body>

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `test`: Test additions/changes
- `chore`: Build process, dependencies

### Branching

(To be defined based on team preferences)

Suggested:
- `main` - Stable code
- `dev` - Development branch
- `feature/*` - Feature branches

## Debugging

### Client-Side

1. Open browser DevTools (F12)
2. Source maps are enabled - can debug TypeScript directly
3. React DevTools extension for component inspection

**Common issues:**
- White screen: Check console for errors
- WebSocket not connecting: Check server is running on port 3001
- Styles missing: Ensure `app.css` is included in HTML

### Server-Side

Bun has built-in debugging support:

```bash
# Run with debugger
bun --inspect src/server/index.ts

# Or with breakpoints
bun --inspect-brk src/server/index.ts
```

Then connect with Chrome DevTools or VS Code debugger.

**Common issues:**
- Port 3001 in use: Kill process or change port in `src/server/index.ts`
- WebSocket errors: Check browser console and server logs
- 404 errors: Ensure `bun run build` was executed

### Logging

**Client:** Use `console.log()` - visible in browser console

**Server:** Logs appear in terminal where server is running

Current logging:
- WebSocket connections/disconnections
- WebSocket messages received
- Server startup message

## Environment Variables

Currently not using any environment variables.

Future setup might include:
- `PORT` - Server port (default 3001)
- `NODE_ENV` - Development/production mode
- `DATABASE_URL` - Database connection string

## Testing

### Current State
No tests implemented yet.

### Future Testing Strategy

**Unit Tests** (Bun built-in test runner):
```typescript
// example.test.ts
import { test, expect } from "bun:test";

test("example", () => {
  expect(1 + 1).toBe(2);
});
```

**Integration Tests**:
- WebSocket communication
- Server endpoints
- Document operations

**E2E Tests** (Playwright):
- Full user workflows
- Multi-user collaboration
- Browser compatibility

## Troubleshooting

### Build Fails

**Error: Multiple files share the same output path**
- Solution: Clear `public/` and rebuild: `rm -rf public && bun run build`

**Error: Module not found**
- Solution: Run `bun install` to ensure dependencies are installed

### Server Won't Start

**Error: EADDRINUSE (port in use)**
- Solution: Kill process on port 3001 or change port in `src/server/index.ts`
- Find process: `lsof -ti:3001`
- Kill process: `kill -9 $(lsof -ti:3001)`

**Error: Cannot find module**
- Solution: Ensure you've run `bun run build` first

### Runtime Errors

**Browser: Failed to fetch**
- Ensure server is running
- Check URL is http://localhost:3001

**WebSocket: Connection refused**
- Ensure server is running
- Check WebSocket endpoint is ws://localhost:3001/ws

## Performance Tips

### Development

- Rebuild only when necessary (no watch mode yet)
- Use browser DevTools Performance tab to profile
- Check Network tab for large asset loads

### Production (Future)

- Enable minification in build
- Use production React build
- Enable gzip compression
- Consider CDN for static assets

## IDE Setup

### VS Code

Recommended extensions:
- **ESLint** (when configured)
- **Prettier** (when configured)
- **TypeScript and JavaScript Language Features** (built-in)
- **React Developer Tools**

Suggested settings:
```json
{
  "editor.formatOnSave": true,
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## Contributing

### Before Submitting Changes

1. Ensure code builds: `bun run build`
2. Test locally: `bun run dev`
3. Check for console errors
4. Write clear commit messages

### Code Review Checklist

- [ ] TypeScript compiles without errors
- [ ] No console errors in browser
- [ ] WebSocket connection works
- [ ] UI renders correctly
- [ ] Code follows project conventions
- [ ] Documentation updated if needed

## Resources

- [Bun Documentation](https://bun.sh/docs)
- [React Documentation](https://react.dev)
- [MDXEditor Docs](https://mdxeditor.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Getting Help

- Check existing documentation in `docs/`
- Review `docs/architecture.md` for technical details
- Check GitHub issues (when repo is public)
- Ask in team chat (when team exists)

---

*Last updated: 2025-10-17*
