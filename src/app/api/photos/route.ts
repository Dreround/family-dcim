import { z } from "zod";

import { fail, handleApiError, ok } from "@/lib/api";
import { photoMutationSchema, photoQuerySchema } from "@/lib/validators/photo";
import { createPhoto, listPhotos } from "@/server/services/photoService";

function emptyToUndefined(value?: string | null) {
  return value && value.trim() ? value.trim() : undefined;
}

export async function GET(request: Request) {
  try {
    const query = Object.fromEntries(new URL(request.url).searchParams.entries());
    const params = photoQuerySchema.parse(query);
    const photos = await listPhotos(params);
    return ok(photos);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return fail("INVALID_QUERY", "照片筛选参数无效。", 400, error.flatten());
    }
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const data = photoMutationSchema.parse(payload);

    const created = await createPhoto({
      title: data.title,
      description: emptyToUndefined(data.description),
      story: emptyToUndefined(data.story),
      takenAt: data.takenAt,
      approximateDateText: emptyToUndefined(data.approximateDateText),
      fileKey: data.fileKey,
      fileUrl: data.fileUrl,
      thumbnailUrl: data.thumbnailUrl,
      status: data.status,
      location: data.locationId ? { connect: { id: data.locationId } } : undefined,
      event: data.eventId ? { connect: { id: data.eventId } } : undefined,
      people: data.people?.map((item) => ({
        personId: item.personId,
        note: emptyToUndefined(item.note),
        faceX: item.faceX,
        faceY: item.faceY,
        faceWidth: item.faceWidth,
        faceHeight: item.faceHeight
      }))
    });

    return ok(created, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return fail("INVALID_BODY", "照片数据校验失败。", 400, error.flatten());
    }
    return handleApiError(error);
  }
}
