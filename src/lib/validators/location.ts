import { z } from "zod";

export const locationMutationSchema = z.object({
  name: z.string().trim().min(1, "地点名称不能为空").max(120),
  address: z.string().trim().max(255).optional().or(z.literal("")),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  description: z.string().trim().max(1000).optional().or(z.literal(""))
});
