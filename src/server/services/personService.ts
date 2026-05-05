import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";

const personInclude = {
  photos: {
    include: {
      photo: true
    }
  },
  relationsFrom: {
    include: {
      toPerson: true
    }
  },
  relationsTo: {
    include: {
      fromPerson: true
    }
  }
} satisfies Prisma.PersonInclude;

export async function listPeople() {
  return prisma.person.findMany({
    orderBy: [{ isSelf: "desc" }, { birthDate: "asc" }, { createdAt: "asc" }]
  });
}

export async function getPersonById(id: string) {
  return prisma.person.findUnique({
    where: { id },
    include: personInclude
  });
}

export async function createPerson(data: Prisma.PersonCreateInput) {
  return prisma.person.create({ data });
}

export async function updatePerson(id: string, data: Prisma.PersonUpdateInput) {
  return prisma.person.update({
    where: { id },
    data
  });
}

export async function deletePerson(id: string) {
  return prisma.person.delete({
    where: { id }
  });
}
