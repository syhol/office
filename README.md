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
│   ├── client/     # Frontend application
│   ├── server/     # Backend server
│   └── shared/     # Shared utilities and types
├── docs/           # Documentation
└── tests/          # Test suites
```

## Tech Stack

- **Frontend**: Modern JavaScript/HTML/CSS
- **Backend**: Node.js
- **Document Format**: Markdown with extensions
- **Real-time**: WebSockets for collaborative editing

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Contributing

This is a free and open-source project. Contributions are welcome!

## License

MIT License - see LICENSE file for details
