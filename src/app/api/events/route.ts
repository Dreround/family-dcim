import { z } from "zod";

import { fail, handleApiError, ok } from "@/lib/api";
import { eventMutationSchema } from "@/lib/validators/event";
import { createEvent, listEvents } from "@/server/services/eventService";

function emptyToUndefined(value?: string | null) {
  return value && value.trim() ? value.trim() : undefined;
}

export async function GET() {
  try {
    const events = await listEvents();
    return ok(events);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const data = eventMutationSchema.parse(payload);
    const event = await createEvent({
      title: data.title,
      type: data.type,
      eventDate: data.eventDate,
      description: emptyToUndefined(data.description),
      location: data.locationId ? { connect: { id: data.locationId } } : undefined
    });
    return ok(event, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return fail("INVALID_BODY", "事件数据校验失败。", 400, error.flatten());
    }
    return handleApiError(error);
  }
}
