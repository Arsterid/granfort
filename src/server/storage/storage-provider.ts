export type StorageContentType = "image/jpeg" | "image/png" | "image/webp";

export interface StoredFile {
  data: Buffer;
  contentType: StorageContentType;
}

export interface StorageProvider {
  save(input: { key: string; data: Uint8Array; contentType: StorageContentType }): Promise<void>;

  read(key: string): Promise<StoredFile | null>;

  delete(key: string): Promise<void>;
}
