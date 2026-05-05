import { z } from "zod";

import { fail, handleApiError, ok } from "@/lib/api";
import { getTimelineData } from "@/server/services/timelineService";

export async function GET(request: Request) {
  try {
    const year = new URL(request.url).searchParams.get("year");
    const parsedYear = year ? z.coerce.number().int().parse(year) : undefined;
    const data = await getTimelineData(parsedYear);
    return ok(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return fail("INVALID_QUERY", "年份参数无效。", 400, error.flatten());
    }
    return handleApiError(error);
  }
}
