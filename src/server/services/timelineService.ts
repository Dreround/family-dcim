import { prisma } from "@/lib/db";

export async function getTimelineData(year?: number) {
  const [photos, memoirs] = await Promise.all([
    prisma.photo.findMany({
      where: year
        ? {
            takenAt: {
              gte: new Date(`${year}-01-01T00:00:00`),
              lte: new Date(`${year}-12-31T23:59:59`)
            }
          }
        : undefined,
      include: {
        location: true,
        event: true,
        people: {
          include: {
            person: true
          }
        }
      },
      orderBy: [{ takenAt: "desc" }, { createdAt: "desc" }]
    }),
    prisma.familyMemoir.findMany({
      where: year
        ? {
            date: {
              gte: new Date(`${year}-01-01T00:00:00`),
              lte: new Date(`${year}-12-31T23:59:59`)
            }
          }
        : undefined,
      include: {
        location: true,
        people: { include: { person: true } },
        photos: { include: { photo: true } }
      },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }]
    })
  ]);

  const grouped = new Map<string, { year: string; photos: typeof photos; memoirs: typeof memoirs }>();

  for (const photo of photos) {
    const key = photo.takenAt ? `${photo.takenAt.getFullYear()}` : "时间待确认";
    const entry = grouped.get(key) ?? { year: key, photos: [], memoirs: [] };
    entry.photos.push(photo);
    grouped.set(key, entry);
  }

  for (const memoir of memoirs) {
    const key = memoir.date ? `${memoir.date.getFullYear()}` : "时间待确认";
    const entry = grouped.get(key) ?? { year: key, photos: [], memoirs: [] };
    entry.memoirs.push(memoir);
    grouped.set(key, entry);
  }

  return Array.from(grouped.values()).sort((a, b) => {
    if (a.year === "时间待确认") {
      return 1;
    }

    if (b.year === "时间待确认") {
      return -1;
    }

    return Number(b.year) - Number(a.year);
  });
}
