import { prisma } from "@/lib/db";

export async function getFormOptions() {
  const [people, locations, events] = await Promise.all([
    prisma.person.findMany({
      select: {
        id: true,
        name: true
      },
      orderBy: { createdAt: "asc" }
    }),
    prisma.location.findMany({
      select: {
        id: true,
        name: true
      },
      orderBy: { name: "asc" }
    }),
    prisma.familyEvent.findMany({
      select: {
        id: true,
        title: true
      },
      orderBy: [{ eventDate: "desc" }, { title: "asc" }]
    })
  ]);

  return {
    people: people.map((item) => ({ id: item.id, label: item.name })),
    locations: locations.map((item) => ({ id: item.id, label: item.name })),
    events: events.map((item) => ({ id: item.id, label: item.title }))
  };
}
