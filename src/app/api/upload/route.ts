import { z } from "zod";

import { env } from "@/lib/env";
import { fail, handleApiError, ok } from "@/lib/api";
import { getStorageProvider } from "@/lib/storage";

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return fail("INVALID_FILE", "请上传图片文件。", 400);
    }

    if (!allowedMimeTypes.includes(file.type)) {
      return fail("INVALID_FILE_TYPE", "仅允许上传 jpg、jpeg、png、webp 图片。", 400);
    }

    const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      return fail("INVALID_FILE_EXTENSION", "文件扩展名不在允许范围内。", 400);
    }

    if (file.size > env.maxUploadSizeMb * 1024 * 1024) {
      return fail("FILE_TOO_LARGE", `文件大小不能超过 ${env.maxUploadSizeMb}MB。`, 400);
    }

    const bytes = await file.arrayBuffer();
    const uploaded = await getStorageProvider().upload({
      fileName: file.name,
      contentType: file.type,
      buffer: Buffer.from(bytes)
    });

    return ok(uploaded, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return fail("INVALID_UPLOAD", "上传参数不合法。", 400, error.flatten());
    }
    return handleApiError(error);
  }
}
