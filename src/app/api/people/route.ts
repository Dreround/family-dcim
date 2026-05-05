import { z } from "zod";

import { fail, handleApiError, ok } from "@/lib/api";
import { personMutationSchema } from "@/lib/validators/person";
import { createPerson, listPeople } from "@/server/services/personService";

function emptyToUndefined(value?: string | null) {
  return value && value.trim() ? value.trim() : undefined;
}

export async function GET() {
  try {
    const people = await listPeople();
    return ok(people);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const data = personMutationSchema.parse(payload);
    const person = await createPerson({
      name: data.name,
      gender: data.gender ?? undefined,
      birthDate: data.birthDate,
      deathDate: data.deathDate,
      nickname: emptyToUndefined(data.nickname),
      relationName: emptyToUndefined(data.relationName),
      avatarUrl: emptyToUndefined(data.avatarUrl),
      bio: emptyToUndefined(data.bio),
      note: emptyToUndefined(data.note),
      isSelf: data.isSelf
    });
    return ok(person, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return fail("INVALID_BODY", "人物数据校验失败。", 400, error.flatten());
    }
    return handleApiError(error);
  }
}
