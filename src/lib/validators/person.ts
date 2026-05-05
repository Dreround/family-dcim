import { Gender } from "@prisma/client";
import { z } from "zod";

const optionalDate = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? new Date(value) : undefined));

export const personMutationSchema = z.object({
  name: z.string().trim().min(1, "姓名不能为空").max(80),
  gender: z.nativeEnum(Gender).optional().nullable(),
  birthDate: optionalDate,
  deathDate: optionalDate,
  nickname: z.string().trim().max(80).optional().or(z.literal("")),
  relationName: z.string().trim().max(80).optional().or(z.literal("")),
  avatarUrl: z.string().trim().max(500).optional().or(z.literal("")),
  bio: z.string().trim().max(1000).optional().or(z.literal("")),
  note: z.string().trim().max(1000).optional().or(z.literal("")),
  isSelf: z.boolean().default(false)
});
