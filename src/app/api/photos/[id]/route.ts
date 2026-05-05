import { z } from "zod";

import { fail, handleApiError, ok } from "@/lib/api";
import { photoMutationSchema } from "@/lib/validators/photo";
import { deletePhoto, getPhotoById, updatePhoto } from "@/server/services/photoService";

function emptyToUndefined(value?: string | null) {
  return value && value.trim() ? value.trim() : undefined;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const photo = await getPhotoById(id);
    if (!photo) {
      return fail("NOT_FOUND", "照片不存在。", 404);
    }
    return ok(photo);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const payload = await request.json();
    const data = photoMutationSchema.parse(payload);

    const updated = await updatePhoto(id, {
        title: data.title,
        description: emptyToUndefined(data.description),
        story: emptyToUndefined(data.story),
        takenAt: data.takenAt,
        approximateDateText: emptyToUndefined(data.approximateDateText),
        fileKey: data.fileKey,
        fileUrl: data.fileUrl,
        thumbnailUrl: data.thumbnailUrl,
        status: data.status,
        location: data.locationId ? { connect: { id: data.locationId } } : { disconnect: true },
        event: data.eventId ? { connect: { id: data.eventId } } : { disconnect: true },
        people: data.people?.map((item) => ({
          personId: item.personId,
          note: emptyToUndefined(item.note),
          faceX: item.faceX,
          faceY: item.faceY,
          faceWidth: item.faceWidth,
          faceHeight: item.faceHeight
        }))
      });

    return ok(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return fail("INVALID_BODY", "照片数据校验失败。", 400, error.flatten());
    }
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deletePhoto(id);
    return ok({ id });
  } catch (error) {
    return handleApiError(error);
  }
}
