import { env } from "@/lib/env";
import { LocalStorageProvider } from "@/lib/storage/local-storage";
import { S3StorageProvider } from "@/lib/storage/s3-storage";
import type { StorageProvider } from "@/lib/storage/types";

let storageProvider: StorageProvider | null = null;

export function getStorageProvider() {
  if (storageProvider) {
    return storageProvider;
  }

  storageProvider =
    env.storageDriver === "s3" ? new S3StorageProvider() : new LocalStorageProvider();

  return storageProvider;
}
