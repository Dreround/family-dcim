import type { StorageProvider, UploadPayload } from "@/lib/storage/types";

export class S3StorageProvider implements StorageProvider {
  async upload(_payload: UploadPayload) {
    throw new Error("当前版本尚未启用 S3/MinIO 对象存储，请先使用本地存储模式。");
  }

  async delete(_fileKey: string) {
    throw new Error("当前版本尚未启用 S3/MinIO 对象存储删除能力。");
  }

  getPublicUrl(fileKey: string) {
    return fileKey;
  }
}
