// Repository interface for document storage
// This abstraction allows easy swapping of storage backends

export interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDocumentInput {
  title: string;
  content: string;
}

export interface UpdateDocumentInput {
  title?: string;
  content?: string;
}

export interface DocumentRepository {
  // Create a new document
  create(input: CreateDocumentInput): Promise<Document>;

  // Find a document by ID
  findById(id: string): Promise<Document | null>;

  // Find all documents
  findAll(): Promise<Document[]>;

  // Update a document
  update(id: string, input: UpdateDocumentInput): Promise<Document | null>;

  // Delete a document
  delete(id: string): Promise<boolean>;
}
