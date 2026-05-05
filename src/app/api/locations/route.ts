import { z } from "zod";

import { fail, handleApiError, ok } from "@/lib/api";
import { locationMutationSchema } from "@/lib/validators/location";
import { createLocation, listLocations } from "@/server/services/locationService";

function emptyToUndefined(value?: string | null) {
  return value && value.trim() ? value.trim() : undefined;
}

export async function GET() {
  try {
    const locations = await listLocations();
    return ok(locations);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const data = locationMutationSchema.parse(payload);
    const location = await createLocation({
      name: data.name,
      address: emptyToUndefined(data.address),
      latitude: data.latitude ?? undefined,
      longitude: data.longitude ?? undefined,
      description: emptyToUndefined(data.description)
    });
    return ok(location, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return fail("INVALID_BODY", "地点数据校验失败。", 400, error.flatten());
    }
    return handleApiError(error);
  }
}
