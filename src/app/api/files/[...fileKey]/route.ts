import { readFile } from "fs/promises";
import path from "path";

import { env } from "@/lib/env";
import { fail } from "@/lib/api";

const contentTypeMap = new Map([
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".png", "image/png"],
  [".webp", "image/webp"]
]);

export async function GET(_request: Request, { params }: { params: Promise<{ fileKey: string[] }> }) {
  try {
    const { fileKey } = await params;
    const safeSegments = fileKey.filter((segment) => !segment.includes(".."));
    const absolutePath = path.resolve(process.cwd(), env.uploadDir, ...safeSegments);
    const buffer = await readFile(absolutePath);
    const extension = path.extname(absolutePath).toLowerCase();

    return new Response(buffer, {
      headers: {
        "Content-Type": contentTypeMap.get(extension) ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  } catch {
    return fail("FILE_NOT_FOUND", "文件不存在。", 404);
  }
}
