import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function listLocations() {
  return prisma.location.findMany({
    include: {
      photos: true,
      events: true,
      memoirs: true
    },
    orderBy: { name: "asc" }
  });
}

export async function getLocationById(id: string) {
  return prisma.location.findUnique({
    where: { id },
    include: {
      photos: true,
      events: true,
      memoirs: true
    }
  });
}

export async function createLocation(data: Prisma.LocationCreateInput) {
  return prisma.location.create({ data });
}
