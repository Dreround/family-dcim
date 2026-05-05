import { handleApiError } from "@/lib/api";
import { exportArchiveData } from "@/server/services/exportService";

export async function GET() {
  try {
    const data = await exportArchiveData();
    return new Response(JSON.stringify(data, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="family-archive-${new Date().toISOString().slice(0, 10)}.json"`
      }
    });
  } catch (error) {
    return handleApiError(error);
  }
}
