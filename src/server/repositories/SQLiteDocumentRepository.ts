import { Database } from "bun:sqlite";
import type {
  Document,
  DocumentRepository,
  CreateDocumentInput,
  UpdateDocumentInput,
} from "./DocumentRepository";

export class SQLiteDocumentRepository implements DocumentRepository {
  private db: Database;

  constructor(dbPath: string = "./data/office.db") {
    this.db = new Database(dbPath, { create: true });
    this.initializeSchema();
  }

  private initializeSchema(): void {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `);

    // Create index for faster queries
    this.db.run(`
      CREATE INDEX IF NOT EXISTS idx_documents_created_at
      ON documents(created_at DESC)
    `);
  }

  private generateId(): string {
    return `doc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  private rowToDocument(row: any): Document {
    return {
      id: row.id,
      title: row.title,
      content: row.content,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  async create(input: CreateDocumentInput): Promise<Document> {
    const id = this.generateId();
    const now = Date.now();

    this.db.run(
      `
      INSERT INTO documents (id, title, content, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `,
      [id, input.title, input.content, now, now],
    );

    return {
      id,
      title: input.title,
      content: input.content,
      createdAt: new Date(now),
      updatedAt: new Date(now),
    };
  }

  async findById(id: string): Promise<Document | null> {
    const row = this.db.query("SELECT * FROM documents WHERE id = ?").get(id);
    return row ? this.rowToDocument(row) : null;
  }

  async findAll(): Promise<Document[]> {
    const rows = this.db.query("SELECT * FROM documents ORDER BY created_at DESC").all();
    return rows.map((row) => this.rowToDocument(row));
  }

  async update(id: string, input: UpdateDocumentInput): Promise<Document | null> {
    const existing = await this.findById(id);
    if (!existing) {
      return null;
    }

    const title = input.title ?? existing.title;
    const content = input.content ?? existing.content;
    const updatedAt = Date.now();

    this.db.run(
      `
      UPDATE documents
      SET title = ?, content = ?, updated_at = ?
      WHERE id = ?
    `,
      [title, content, updatedAt, id],
    );

    return {
      ...existing,
      title,
      content,
      updatedAt: new Date(updatedAt),
    };
  }

  async delete(id: string): Promise<boolean> {
    const result = this.db.run("DELETE FROM documents WHERE id = ?", [id]);
    return result.changes > 0;
  }

  // Helper method to close the database connection
  close(): void {
    this.db.close();
  }
}
