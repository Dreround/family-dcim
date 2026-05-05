import { FamilyEventType } from "@prisma/client";
import { z } from "zod";

export const eventMutationSchema = z.object({
  title: z.string().trim().min(1, "事件名称不能为空").max(120),
  type: z.nativeEnum(FamilyEventType).default(FamilyEventType.OTHER),
  eventDate: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? new Date(value) : undefined)),
  locationId: z.string().cuid().optional().nullable(),
  description: z.string().trim().max(1000).optional().or(z.literal(""))
});
