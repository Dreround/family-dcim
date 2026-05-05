import { PhotoStatus } from "@prisma/client";

import { prisma } from "@/lib/db";

export async function getDashboardData() {
  const [photoCount, personCount, locationCount, eventCount, memoirCount, recentPhotos, people, memoirs, photos] =
    await Promise.all([
      prisma.photo.count(),
      prisma.person.count(),
      prisma.location.count(),
      prisma.familyEvent.count(),
      prisma.familyMemoir.count(),
      prisma.photo.findMany({
        include: {
          location: true,
          event: true,
          people: { include: { person: true } }
        },
        take: 6,
        orderBy: [{ takenAt: "desc" }, { createdAt: "desc" }]
      }),
      prisma.person.findMany({
        orderBy: [{ isSelf: "desc" }, { createdAt: "asc" }],
        take: 6
      }),
      prisma.familyMemoir.findMany({
        include: {
          location: true
        },
        take: 5,
        orderBy: [{ date: "desc" }, { createdAt: "desc" }]
      }),
      prisma.photo.findMany({
        where: {
          OR: [
            { takenAt: null },
            { locationId: null },
            { people: { none: {} } },
            { status: PhotoStatus.PENDING_CONFIRMATION }
          ]
        },
        take: 5,
        orderBy: [{ createdAt: "desc" }]
      })
    ]);

  const pending = await prisma.photo.count({
    where: {
      OR: [
        { takenAt: null },
        { locationId: null },
        { people: { none: {} } },
        { status: { not: PhotoStatus.ORGANIZED } }
      ]
    }
  });

  return {
    stats: {
      photos: photoCount,
      people: personCount,
      locations: locationCount,
      events: eventCount,
      memoirs: memoirCount,
      pending
    },
    recentPhotos,
    peoplePreview: people,
    memoirPreview: memoirs,
    pendingPreview: photos
  };
}
