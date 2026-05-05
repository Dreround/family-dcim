export type StoredFile = {
  fileKey: string;
  fileUrl: string;
  thumbnailUrl: string;
};

export type UploadPayload = {
  fileName: string;
  contentType: string;
  buffer: Buffer;
};

export interface StorageProvider {
  upload(payload: UploadPayload): Promise<StoredFile>;
  delete(fileKey: string): Promise<void>;
  getPublicUrl(fileKey: string): string;
}
