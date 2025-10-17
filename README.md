# Office

A free and open-source alternative to Google Docs, built on open standards.

## Vision

Office aims to provide a collaborative document editing experience that respects user freedom and data sovereignty. Unlike proprietary solutions, Office is built on open standards like Markdown, ensuring your documents remain portable and accessible.

## Features (Planned)

- **Markdown-based editing**: Write documents using standard Markdown syntax
- **Real-time collaboration**: Multiple users can edit documents simultaneously
- **Open standards**: Documents stored in portable, human-readable formats
- **Self-hostable**: Run on your own infrastructure for complete control
- **Privacy-focused**: Your data stays where you want it
- **Export/Import**: Support for various formats (PDF, DOCX, HTML, etc.)

## Project Structure

```
office/
├── src/
│   ├── client/     # React frontend with MDXEditor
│   ├── server/     # Bun server with WebSocket support
│   └── shared/     # Shared utilities and types
├── public/         # Built static files (generated)
├── docs/           # Documentation
└── tests/          # Test suites
```

## Tech Stack

- **Runtime**: Bun (fast JavaScript runtime and bundler)
- **Frontend**: React + TypeScript
- **Editor**: MDXEditor (rich markdown editing)
- **Backend**: Bun server with native WebSocket support
- **Document Format**: Markdown
- **Real-time**: WebSockets for collaborative editing

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed (v1.3.0+)
- Or use [mise](https://mise.jdx.dev/) to automatically install the correct version

### Installation & Running

```bash
# Install dependencies
bun install

# Build the frontend
bun run build

# Start the development server
bun run dev

# Or build and start in one command
bun start
```

The application will be available at `http://localhost:3001`

## Contributing

This is a free and open-source project. Contributions are welcome!

## License

MIT License - see LICENSE file for details
