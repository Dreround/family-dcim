import { Prisma, type PhotoStatus } from "@prisma/client";

import { prisma } from "@/lib/db";

type PhotoPersonInput = Prisma.PhotoPersonCreateManyPhotoInput[];
type PhotoCreatePayload = Omit<Prisma.PhotoCreateInput, "people"> & {
  people?: PhotoPersonInput;
};
type PhotoUpdatePayload = Omit<Prisma.PhotoUpdateInput, "people"> & {
  people?: PhotoPersonInput;
};

const photoInclude = {
  location: true,
  event: true,
  people: {
    include: {
      person: true
    }
  }
} satisfies Prisma.PhotoInclude;

export async function listPhotos(filters: {
  q?: string;
  personId?: string;
  locationId?: string;
  eventId?: string;
  status?: PhotoStatus;
  sort?: "asc" | "desc";
}) {
  const where: Prisma.PhotoWhereInput = {
    AND: [
      filters.q
        ? {
            OR: [
              { title: { contains: filters.q, mode: "insensitive" } },
              { description: { contains: filters.q, mode: "insensitive" } },
              { story: { contains: filters.q, mode: "insensitive" } },
              { approximateDateText: { contains: filters.q, mode: "insensitive" } }
            ]
          }
        : {},
      filters.personId ? { people: { some: { personId: filters.personId } } } : {},
      filters.locationId ? { locationId: filters.locationId } : {},
      filters.eventId ? { eventId: filters.eventId } : {},
      filters.status ? { status: filters.status } : {}
    ]
  };

  return prisma.photo.findMany({
    where,
    include: photoInclude,
    orderBy: [{ takenAt: filters.sort ?? "desc" }, { createdAt: "desc" }]
  });
}

export async function getPhotoById(id: string) {
  return prisma.photo.findUnique({
    where: { id },
    include: photoInclude
  });
}

export async function createPhoto(input: PhotoCreatePayload) {
  const { people = [], ...data } = input;

  return prisma.photo.create({
    data: {
      ...data,
      people: people.length
        ? {
            createMany: {
              data: people
            }
          }
        : undefined
    },
    include: photoInclude
  });
}

export async function updatePhoto(id: string, input: PhotoUpdatePayload) {
  const { people, ...data } = input;

  return prisma.$transaction(async (tx) => {
    if (people) {
      await tx.photoPerson.deleteMany({ where: { photoId: id } });
    }

    return tx.photo.update({
      where: { id },
      data: {
        ...data,
        people: people?.length
          ? {
              createMany: {
                data: people
              }
            }
          : undefined
      },
      include: photoInclude
    });
  });
}

export async function deletePhoto(id: string) {
  return prisma.photo.delete({
    where: { id }
  });
}
