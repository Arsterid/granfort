import "server-only";

import { mkdir, readFile, rm, writeFile } from "node:fs/promises";

import { dirname, extname, isAbsolute, relative, resolve, sep } from "node:path";

import type { StorageContentType, StorageProvider } from "./storage-provider";

const extensionByContentType = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
} satisfies Record<StorageContentType, string>;

const contentTypeByExtension: Record<string, StorageContentType | undefined> = {
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export class LocalStorageProvider implements StorageProvider {
  private readonly rootDirectory: string;

  constructor(rootDirectory: string) {
    this.rootDirectory = resolve(rootDirectory);
  }

  private resolveKey(key: string): string {
    const segments = key.split("/");

    if (
      !key ||
      key.startsWith("/") ||
      key.includes("\\") ||
      key.includes("\0") ||
      segments.some((segment) => !segment || segment === "." || segment === "..")
    ) {
      throw new Error("Invalid storage key");
    }

    const filePath = resolve(this.rootDirectory, ...segments);
    const relativePath = relative(this.rootDirectory, filePath);

    if (
      !relativePath ||
      relativePath === ".." ||
      relativePath.startsWith(`..${sep}`) ||
      isAbsolute(relativePath)
    ) {
      throw new Error("Storage key escapes the storage directory");
    }

    return filePath;
  }

  async save(input: {
    key: string;
    data: Uint8Array;
    contentType: StorageContentType;
  }): Promise<void> {
    const filePath = this.resolveKey(input.key);

    const expectedExtension = extensionByContentType[input.contentType];

    if (extname(filePath).toLowerCase() !== expectedExtension) {
      throw new Error("File extension does not match content type");
    }

    await mkdir(dirname(filePath), {
      recursive: true,
    });

    await writeFile(filePath, input.data, {
      flag: "wx",
    });
  }

  async read(key: string) {
    const filePath = this.resolveKey(key);

    const extension = extname(filePath).toLowerCase();

    const contentType = contentTypeByExtension[extension];

    if (!contentType) {
      throw new Error(`Unsupported file extension: ${extension}`);
    }

    if (!contentType) {
      throw new Error("Unsupported file extension");
    }

    try {
      const data = await readFile(filePath);

      return {
        data,
        contentType,
      };
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "ENOENT"
      ) {
        return null;
      }

      throw error;
    }
  }

  async delete(key: string): Promise<void> {
    const filePath = this.resolveKey(key);

    await rm(filePath, {
      force: true,
    });
  }
}
