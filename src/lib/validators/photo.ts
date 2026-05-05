import { PhotoStatus } from "@prisma/client";
import { z } from "zod";

const optionalDate = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? new Date(value) : undefined));

export const photoPersonLinkSchema = z.object({
  personId: z.string().cuid(),
  note: z.string().trim().max(500).optional(),
  faceX: z.number().optional(),
  faceY: z.number().optional(),
  faceWidth: z.number().optional(),
  faceHeight: z.number().optional()
});

export const photoMutationSchema = z.object({
  title: z.string().trim().min(1, "照片标题不能为空").max(120),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  story: z.string().trim().max(2000).optional().or(z.literal("")),
  takenAt: optionalDate,
  approximateDateText: z.string().trim().max(120).optional().or(z.literal("")),
  fileKey: z.string().trim().min(1),
  fileUrl: z.string().trim().min(1),
  thumbnailUrl: z.string().trim().min(1),
  status: z.nativeEnum(PhotoStatus).default(PhotoStatus.PENDING_CONFIRMATION),
  locationId: z.string().cuid().optional().nullable(),
  eventId: z.string().cuid().optional().nullable(),
  people: z.array(photoPersonLinkSchema).optional()
});

export const photoQuerySchema = z.object({
  personId: z.string().cuid().optional(),
  locationId: z.string().cuid().optional(),
  eventId: z.string().cuid().optional(),
  status: z.nativeEnum(PhotoStatus).optional(),
  sort: z.enum(["asc", "desc"]).default("desc"),
  q: z.string().trim().optional()
});
