import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

import { env } from "@/lib/env";
import { slugFileName } from "@/lib/utils";
import type { StorageProvider, UploadPayload } from "@/lib/storage/types";

export class LocalStorageProvider implements StorageProvider {
  async upload(payload: UploadPayload) {
    const uploadsRoot = path.resolve(process.cwd(), env.uploadDir);
    const datedFolder = new Date().toISOString().slice(0, 10);
    const fileName = `${Date.now()}-${slugFileName(payload.fileName)}`;
    const fileKey = path.posix.join(datedFolder, fileName);
    const targetFile = path.join(uploadsRoot, datedFolder, fileName);

    await mkdir(path.dirname(targetFile), { recursive: true });
    await writeFile(targetFile, payload.buffer);

    const fileUrl = this.getPublicUrl(fileKey);

    return {
      fileKey,
      fileUrl,
      thumbnailUrl: fileUrl
    };
  }

  async delete(fileKey: string) {
    const uploadsRoot = path.resolve(process.cwd(), env.uploadDir);
    const targetFile = path.join(uploadsRoot, fileKey);
    await unlink(targetFile).catch(() => undefined);
  }

  getPublicUrl(fileKey: string) {
    return `/api/files/${fileKey}`;
  }
}
