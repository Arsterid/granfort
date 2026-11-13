import "server-only";
import { LocalStorageProvider } from "./local-storage.provider";
import type { StorageProvider } from "./storage-provider";

let storageProvider: StorageProvider | null = null;

export function getStorageProvider(): StorageProvider {
  if (storageProvider) {
    return storageProvider;
  }

  const uploadDir = process.env.UPLOAD_DIR;

  if (!uploadDir) {
    throw new Error("UPLOAD_DIR is not configured");
  }

  storageProvider = new LocalStorageProvider(uploadDir);

  return storageProvider;
}
