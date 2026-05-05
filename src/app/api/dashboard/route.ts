import { handleApiError, ok } from "@/lib/api";
import { getDashboardData } from "@/server/services/dashboardService";

export async function GET() {
  try {
    const dashboard = await getDashboardData();
    return ok(dashboard);
  } catch (error) {
    return handleApiError(error);
  }
}
