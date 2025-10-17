# Roadmap

This document outlines the planned features and improvements for Office.

## Project Philosophy

**Iterative, not incremental:** Build complete, working features end-to-end rather than partially implementing many things.

## Current Status

### Completed ✅

- [x] Project setup with Bun runtime
- [x] React + TypeScript frontend
- [x] MDXEditor integration with full toolbar
- [x] WebSocket infrastructure (server + client connection)
- [x] Static file serving from `public/`
- [x] Build pipeline using Bun bundler
- [x] Basic project documentation

### In Progress 🚧

None currently.

### Blocked 🚫

None currently.

## Priorities

### P0 - Critical (MVP Features)

These features are essential for a functional multi-user document editor.

#### 1. Development Tooling
**Status:** Not started
**Effort:** Small (1 day)

**Description:**
Set up linting, formatting, and Neovim integration for better DX.

**Technical approach:**
- Add Biome for linting and formatting (replaces ESLint + Prettier)
- Configure `.lazy.lua` for Neovim with LSP, formatters, etc.
- Pre-commit hooks for auto-formatting

**Acceptance criteria:**
- [x] Biome installed and configured
- [x] Auto-format on save
- [x] Linting errors shown in editor
- [x] `.lazy.lua` configured for optimal Neovim experience
- [x] Pre-commit hooks run Biome

**Dependencies:** None

**Commands:**
```bash
bun add -d @biomejs/biome
bunx @biomejs/biome init
```

---

#### 2. Document Persistence
**Status:** Not started
**Effort:** Medium (2-3 days)

**Description:**
Complete end-to-end document storage: save, load, list, delete documents using SQLite.

**Technical approach:**
- Use Bun's built-in SQLite for storage
- Schema: `documents (id, title, content, created_at, updated_at)`
- REST API endpoints: GET/POST/PUT/DELETE `/api/documents`
- Document listing UI with create/delete actions
- Document switching in UI

**Acceptance criteria:**
- [x] Documents persist across server restarts
- [x] Can create new documents with titles
- [x] Can delete documents
- [x] Can list all documents in sidebar
- [x] Can switch between documents
- [x] Current document auto-saves

**Dependencies:** None

---

#### 3. OAuth Authentication
**Status:** Not started
**Effort:** Medium (3-5 days)

**Description:**
User authentication using OAuth providers only (no custom auth). Pocket ID preferred.

**Technical approach:**
- OAuth providers: Pocket ID (primary), GitHub, Google (fallback)
- JWT tokens for session management
- User schema: `users (id, provider, provider_id, email, name, avatar)`
- Document ownership: `documents.user_id`
- No password storage - OAuth only!

**Acceptance criteria:**
- [x] Users can sign in with Pocket ID
- [x] Users can sign in with GitHub or Google
- [x] Users can only see their own documents
- [x] User identity shown in collaboration (cursors)
- [x] Session persists across page reloads
- [x] Sign out functionality

**Dependencies:** Document persistence (need to associate docs with users)

**Resources:**
- [Pocket ID](https://pocketid.io/)
- OAuth libraries for Bun

---

#### 4. Real-time Collaboration (CRDT)
**Status:** Not started
**Effort:** Large (1-2 weeks)

**Description:**
Complete end-to-end real-time collaboration with CRDTs. Multiple users editing same document with conflict-free merging.

**Technical approach:**
- Integrate Yjs (mature CRDT library)
- Create custom Yjs provider for Bun WebSocket
- Bind Yjs document to MDXEditor
- Add user presence (cursors, selections, online indicators)
- Persist CRDT state to database for document recovery

**Acceptance criteria:**
- [x] Multiple users can edit simultaneously
- [x] Changes merge without conflicts
- [x] See other users' cursors and selections
- [x] See who's online in the document
- [x] No data loss during concurrent edits
- [x] Works offline and syncs when reconnected
- [x] Document state persists (can reload and continue)

**Dependencies:** Document persistence, User authentication

**Resources:**
- [Yjs Documentation](https://docs.yjs.dev/)
- [y-websocket Provider](https://github.com/yjs/y-websocket)

**Note:** This is a complete feature - don't start until we can finish it end-to-end.

---

### P1 - High Priority (Enhanced MVP)

These features significantly improve the user experience.

#### 5. Hot Reload / Watch Mode
**Status:** Not started
**Effort:** Small (1 day)

**Description:**
Automatically rebuild and reload when code changes during development.

**Technical approach:**
- Use Bun's `--watch` flag for server
- File watcher for client code with auto-rebuild
- LiveReload or similar for browser refresh

**Acceptance criteria:**
- [x] Server restarts on src/server/ changes
- [x] Client rebuilds on src/client/ changes
- [x] Browser auto-reloads on rebuild

**Dependencies:** None

---

#### 6. Document Sharing / Permissions
**Status:** Not started
**Effort:** Medium (2-3 days)

**Description:**
Complete sharing system: invite users, set permissions, manage access.

**Technical approach:**
- Permissions table: `document_permissions (doc_id, user_id, role)`
- Roles: owner, editor, viewer
- Share modal with user search by email
- Real-time permission enforcement in WebSocket
- Email notifications for shares (optional)

**Acceptance criteria:**
- [x] Can share document with other users by email
- [x] Can set permissions (view/edit)
- [x] Can revoke access
- [x] Viewers can't edit, editors can
- [x] Non-shared users can't access
- [x] Share link generation (optional)

**Dependencies:** User authentication, Document persistence, Real-time collaboration

---

#### 7. Export Functionality
**Status:** Not started
**Effort:** Medium (2-4 days)

**Description:**
Complete export system for multiple formats.

**Technical approach:**
- Markdown: Direct export (already in markdown)
- HTML: Convert markdown to HTML (marked.js)
- PDF: Use Puppeteer to render HTML → PDF with styling

**Acceptance criteria:**
- [x] Export to .md file (download)
- [x] Export to HTML (download)
- [x] Export to PDF with proper styling
- [x] Export preserves formatting
- [x] Export includes document title in filename

**Dependencies:** None

---

### P2 - Medium Priority (Nice to Have)

Features that enhance usability but aren't critical.

#### 8. Document Templates
**Status:** Not started
**Effort:** Small (1-2 days)

Complete template system: create from template, save as template.

**Acceptance criteria:**
- [x] Pre-built templates (meeting notes, project plan, etc.)
- [x] Create new document from template
- [x] Save current document as template
- [x] Template library UI

---

#### 9. Version History
**Status:** Not started
**Effort:** Large (1 week)

Complete version history: auto-save versions, browse timeline, restore.

**Technical approach:**
- Use Yjs built-in history/snapshots
- Or periodic document snapshots in database
- UI to browse timeline and preview versions
- Restore to previous version

**Acceptance criteria:**
- [x] Auto-save versions periodically
- [x] View version history timeline
- [x] Preview previous versions
- [x] Restore to any version
- [x] See who made changes in each version

---

#### 10. Search
**Status:** Not started
**Effort:** Small (1-2 days)

Complete search: search all documents, search current document, keyboard shortcuts.

**Technical approach:**
- SQLite full-text search (FTS5)
- Search UI in sidebar
- Cmd/Ctrl+F for current document
- Cmd/Ctrl+Shift+F for all documents

**Acceptance criteria:**
- [x] Search within current document
- [x] Search across all documents
- [x] Highlight search results
- [x] Keyboard shortcuts work
- [x] Fast search (indexed)

---

#### 11. Dark Mode
**Status:** Not started
**Effort:** Small (1 day)

Complete dark mode: toggle, persist preference, system detection.

**Acceptance criteria:**
- [x] Dark theme for entire app
- [x] Toggle button in UI
- [x] Persist preference
- [x] Auto-detect system preference
- [x] Smooth transition between themes

---

#### 12. Mobile Responsive Design
**Status:** Not started
**Effort:** Medium (2-3 days)

Complete mobile support: responsive layout, touch-friendly, mobile toolbar.

**Acceptance criteria:**
- [x] Works on phones (portrait/landscape)
- [x] Works on tablets
- [x] Touch-friendly UI elements
- [x] Mobile-optimized toolbar
- [x] Readable on small screens

---

### P3 - Low Priority (Future Enhancements)

Advanced features for power users.

#### 13. Custom Markdown Extensions
**Status:** Not started
**Effort:** Medium

Complete extension system: mermaid diagrams, LaTeX math, custom syntax.

---

#### 14. Comments / Annotations
**Status:** Not started
**Effort:** Medium (3-5 days)

Complete commenting system: add comments, reply, resolve, notifications.

---

#### 15. Offline Mode / PWA
**Status:** Not started
**Effort:** Medium

Complete offline support: service worker, sync when online, conflict resolution.

---

#### 16. Import from Other Formats
**Status:** Not started
**Effort:** Medium

Complete import system: DOCX, HTML, PDF → Markdown conversion.

---

## Technical Debt

Items that should be addressed to improve code quality.

### Code Quality

- [ ] Add Biome for linting and formatting (**P0 - do first!**)
- [ ] Set up pre-commit hooks
- [ ] Enable TypeScript strict mode
- [ ] Add JSDoc comments to functions

### Testing

- [ ] Set up unit testing (Bun test)
- [ ] Add integration tests for WebSocket
- [ ] Set up E2E testing (Playwright)
- [ ] Add CI/CD pipeline
- [ ] Test coverage reporting

### Performance

- [ ] Optimize bundle size (code splitting)
- [ ] Add compression for API responses
- [ ] Implement caching strategy
- [ ] Add performance monitoring
- [ ] Database query optimization

### Security

- [ ] Add input sanitization
- [ ] Implement rate limiting
- [ ] Add CORS configuration
- [ ] Set up CSP headers
- [ ] Security audit of dependencies

### DevOps

- [ ] Docker containerization
- [ ] Production deployment setup
- [ ] Environment configuration
- [ ] Logging and monitoring
- [ ] Backup strategy for database
- [ ] CI/CD for automated deployments

## Release Plan

### v0.1.0 - MVP (Current)
- [x] Basic editor with MDXEditor
- [x] WebSocket connection
- [x] Build system
- [x] Documentation

### v0.2.0 - Development Tools
- [ ] Biome linting and formatting
- [ ] Neovim configuration (.lazy.lua)
- [ ] Hot reload for development
- [ ] Pre-commit hooks

### v0.3.0 - Persistence
- [ ] Document persistence (SQLite)
- [ ] Document CRUD UI
- [ ] Auto-save

### v0.4.0 - Authentication
- [ ] OAuth with Pocket ID
- [ ] GitHub/Google OAuth fallback
- [ ] User sessions
- [ ] Document ownership

### v0.5.0 - Collaboration
- [ ] Real-time collaboration (Yjs + CRDT)
- [ ] User presence indicators
- [ ] Conflict-free merging
- [ ] Offline support

### v0.6.0 - Sharing
- [ ] Document sharing/permissions
- [ ] Export to markdown/HTML/PDF

### v1.0.0 - Production Ready
- [ ] All P0 and P1 features complete
- [ ] Comprehensive tests
- [ ] Security hardening
- [ ] Production deployment
- [ ] User documentation

## Development Principles

1. **Iterative, not incremental** - Finish complete features before moving on
2. **No custom auth** - OAuth only (Pocket ID preferred)
3. **CRDTs for collaboration** - Yjs when we're ready to implement it fully
4. **Developer experience matters** - Biome, .lazy.lua, hot reload
5. **Simple stack** - Bun primitives, minimal dependencies

---

*Last updated: 2025-10-17*
