import { prisma } from "@/lib/db";

export async function exportArchiveData() {
  const [photos, people, relations, events, locations, memoirs] = await Promise.all([
    prisma.photo.findMany({
      include: {
        people: true
      }
    }),
    prisma.person.findMany(),
    prisma.familyRelation.findMany(),
    prisma.familyEvent.findMany(),
    prisma.location.findMany(),
    prisma.familyMemoir.findMany({
      include: {
        people: true,
        photos: true
      }
    })
  ]);

  return {
    exportedAt: new Date().toISOString(),
    version: 1,
    photos,
    people,
    relations,
    events,
    locations,
    memoirs
  };
}
