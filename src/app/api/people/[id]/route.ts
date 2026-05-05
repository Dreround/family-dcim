import { z } from "zod";

import { fail, handleApiError, ok } from "@/lib/api";
import { personMutationSchema } from "@/lib/validators/person";
import { deletePerson, getPersonById, updatePerson } from "@/server/services/personService";

function emptyToUndefined(value?: string | null) {
  return value && value.trim() ? value.trim() : undefined;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const person = await getPersonById(id);
    if (!person) {
      return fail("NOT_FOUND", "人物不存在。", 404);
    }
    return ok(person);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const payload = await request.json();
    const data = personMutationSchema.parse(payload);
    const person = await updatePerson(id, {
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
    return ok(person);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return fail("INVALID_BODY", "人物数据校验失败。", 400, error.flatten());
    }
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deletePerson(id);
    return ok({ id });
  } catch (error) {
    return handleApiError(error);
  }
}
