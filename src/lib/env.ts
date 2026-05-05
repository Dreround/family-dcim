export const env = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "家庭影像档案馆",
  uploadDir: process.env.UPLOAD_DIR ?? "./uploads",
  maxUploadSizeMb: Number(process.env.MAX_UPLOAD_SIZE_MB ?? "20"),
  storageDriver: process.env.STORAGE_DRIVER ?? "local",
  s3Endpoint: process.env.S3_ENDPOINT ?? "",
  s3Region: process.env.S3_REGION ?? "",
  s3Bucket: process.env.S3_BUCKET ?? "",
  s3AccessKey: process.env.S3_ACCESS_KEY ?? "",
  s3SecretKey: process.env.S3_SECRET_KEY ?? "",
  s3ForcePathStyle: (process.env.S3_FORCE_PATH_STYLE ?? "true") === "true"
};
