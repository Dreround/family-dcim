import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";

export async function listEvents() {
  return prisma.familyEvent.findMany({
    include: {
      location: true,
      photos: true
    },
    orderBy: [{ eventDate: "desc" }, { title: "asc" }]
  });
}

export async function getEventById(id: string) {
  return prisma.familyEvent.findUnique({
    where: { id },
    include: {
      location: true,
      photos: true
    }
  });
}

export async function createEvent(data: Prisma.FamilyEventCreateInput) {
  return prisma.familyEvent.create({ data });
}
