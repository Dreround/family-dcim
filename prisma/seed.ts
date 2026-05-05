import {
  FamilyEventType,
  Gender,
  ImportanceLevel,
  PhotoStatus,
  PrismaClient,
  RelationType,
  UserRole
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.storyPhoto.deleteMany();
  await prisma.storyPerson.deleteMany();
  await prisma.familyRelation.deleteMany();
  await prisma.photoPerson.deleteMany();
  await prisma.familyMemoir.deleteMany();
  await prisma.photo.deleteMany();
  await prisma.familyEvent.deleteMany();
  await prisma.location.deleteMany();
  await prisma.person.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
      name: "家庭管理员",
      email: "admin@example.com",
      passwordHash: "change-me",
      role: UserRole.ADMIN
    }
  });

  const [oldHome, westLake, newHouse] = await Promise.all([
    prisma.location.create({
      data: {
        name: "老家院子",
        address: "湖南省邵阳市某乡村老宅",
        description: "祖辈生活多年的老屋"
      }
    }),
    prisma.location.create({
      data: {
        name: "西湖边",
        address: "浙江省杭州市西湖景区",
        description: "家庭出游常去地点"
      }
    }),
    prisma.location.create({
      data: {
        name: "新居客厅",
        address: "广东省深圳市某小区",
        description: "乔迁后常拍摄合照的地方"
      }
    })
  ]);

  const people = await Promise.all([
    prisma.person.create({
      data: {
        name: "李守诚",
        gender: Gender.MALE,
        relationName: "爷爷",
        birthDate: new Date("1948-05-10"),
        bio: "喜欢修理老物件和记录家中大事。"
      }
    }),
    prisma.person.create({
      data: {
        name: "陈淑兰",
        gender: Gender.FEMALE,
        relationName: "奶奶",
        birthDate: new Date("1950-08-22"),
        bio: "擅长做节日家宴。"
      }
    }),
    prisma.person.create({
      data: {
        name: "李建国",
        gender: Gender.MALE,
        relationName: "爸爸",
        birthDate: new Date("1978-01-19")
      }
    }),
    prisma.person.create({
      data: {
        name: "王秀梅",
        gender: Gender.FEMALE,
        relationName: "妈妈",
        birthDate: new Date("1980-09-03")
      }
    }),
    prisma.person.create({
      data: {
        name: "李晨",
        gender: Gender.MALE,
        relationName: "我",
        birthDate: new Date("2006-03-15"),
        isSelf: true,
        bio: "喜欢整理家庭照片，记录家族故事。"
      }
    })
  ]);

  const [grandpa, grandma, father, mother, me] = people;

  await prisma.familyRelation.createMany({
    data: [
      { fromPersonId: grandpa.id, toPersonId: grandma.id, relationType: RelationType.SPOUSE },
      { fromPersonId: grandma.id, toPersonId: grandpa.id, relationType: RelationType.SPOUSE },
      { fromPersonId: grandpa.id, toPersonId: father.id, relationType: RelationType.PARENT },
      { fromPersonId: grandma.id, toPersonId: father.id, relationType: RelationType.PARENT },
      { fromPersonId: father.id, toPersonId: me.id, relationType: RelationType.PARENT },
      { fromPersonId: mother.id, toPersonId: me.id, relationType: RelationType.PARENT },
      { fromPersonId: father.id, toPersonId: mother.id, relationType: RelationType.SPOUSE },
      { fromPersonId: mother.id, toPersonId: father.id, relationType: RelationType.SPOUSE },
      { fromPersonId: me.id, toPersonId: me.id, relationType: RelationType.SELF }
    ]
  });

  const springEvent = await prisma.familyEvent.create({
    data: {
      title: "春节团圆饭",
      type: FamilyEventType.SPRING_FESTIVAL,
      eventDate: new Date("2024-02-10"),
      locationId: oldHome.id,
      description: "全家回老家过年，拍了很多合影。"
    }
  });

  const travelEvent = await prisma.familyEvent.create({
    data: {
      title: "西湖春游",
      type: FamilyEventType.TRAVEL,
      eventDate: new Date("2023-04-04"),
      locationId: westLake.id,
      description: "清明假期家庭短途出游。"
    }
  });

  const moveEvent = await prisma.familyEvent.create({
    data: {
      title: "新居乔迁",
      type: FamilyEventType.HOUSE_WARMING,
      eventDate: new Date("2022-10-01"),
      locationId: newHouse.id,
      description: "搬入新家后的第一次全家聚会。"
    }
  });

  const photos = await Promise.all([
    prisma.photo.create({
      data: {
        title: "年夜饭合照",
        description: "除夕夜拍摄的全家福。",
        story: "爷爷特地把老式收音机搬出来当背景。",
        takenAt: new Date("2024-02-10T18:30:00"),
        fileKey: "seed/year-dinner.jpg",
        fileUrl: "/placeholder-family-photo.svg",
        thumbnailUrl: "/placeholder-family-photo.svg",
        status: PhotoStatus.ORGANIZED,
        locationId: oldHome.id,
        eventId: springEvent.id
      }
    }),
    prisma.photo.create({
      data: {
        title: "包饺子时刻",
        takenAt: new Date("2024-02-10T16:00:00"),
        fileKey: "seed/dumplings.jpg",
        fileUrl: "/placeholder-family-photo.svg",
        thumbnailUrl: "/placeholder-family-photo.svg",
        status: PhotoStatus.PEOPLE_PENDING,
        locationId: oldHome.id,
        eventId: springEvent.id
      }
    }),
    prisma.photo.create({
      data: {
        title: "西湖边合影",
        description: "断桥附近拍摄的旅行纪念照。",
        takenAt: new Date("2023-04-04T10:20:00"),
        fileKey: "seed/westlake.jpg",
        fileUrl: "/placeholder-family-photo.svg",
        thumbnailUrl: "/placeholder-family-photo.svg",
        status: PhotoStatus.ORGANIZED,
        locationId: westLake.id,
        eventId: travelEvent.id
      }
    }),
    prisma.photo.create({
      data: {
        title: "新家第一张全家福",
        takenAt: new Date("2022-10-01T12:00:00"),
        fileKey: "seed/new-home.jpg",
        fileUrl: "/placeholder-family-photo.svg",
        thumbnailUrl: "/placeholder-family-photo.svg",
        status: PhotoStatus.ORGANIZED,
        locationId: newHouse.id,
        eventId: moveEvent.id
      }
    }),
    prisma.photo.create({
      data: {
        title: "旧相册翻拍",
        approximateDateText: "大约 1998 年夏天",
        fileKey: "seed/old-album.jpg",
        fileUrl: "/placeholder-family-photo.svg",
        thumbnailUrl: "/placeholder-family-photo.svg",
        status: PhotoStatus.DATE_PENDING
      }
    }),
    prisma.photo.create({
      data: {
        title: "待补充地点的随手拍",
        takenAt: new Date("2021-06-12T15:40:00"),
        fileKey: "seed/unknown-location.jpg",
        fileUrl: "/placeholder-family-photo.svg",
        thumbnailUrl: "/placeholder-family-photo.svg",
        status: PhotoStatus.LOCATION_PENDING
      }
    })
  ]);

  await prisma.photoPerson.createMany({
    data: [
      { photoId: photos[0].id, personId: grandpa.id },
      { photoId: photos[0].id, personId: grandma.id },
      { photoId: photos[0].id, personId: father.id },
      { photoId: photos[0].id, personId: mother.id },
      { photoId: photos[0].id, personId: me.id },
      { photoId: photos[1].id, personId: grandma.id },
      { photoId: photos[2].id, personId: father.id },
      { photoId: photos[2].id, personId: mother.id },
      { photoId: photos[2].id, personId: me.id },
      { photoId: photos[3].id, personId: father.id },
      { photoId: photos[3].id, personId: mother.id },
      { photoId: photos[3].id, personId: me.id }
    ]
  });

  const memoirs = await Promise.all([
    prisma.familyMemoir.create({
      data: {
        title: "爷爷第一次用数码相机",
        date: new Date("2008-08-16"),
        content: "那天大家轮流教爷爷按快门，最后拍下了家门口的一棵桂花树。",
        importance: ImportanceLevel.HIGH,
        locationId: oldHome.id
      }
    }),
    prisma.familyMemoir.create({
      data: {
        title: "搬进新家",
        date: new Date("2022-10-01"),
        content: "全家第一次在新居吃饭，照片和故事都值得保存。",
        importance: ImportanceLevel.CRITICAL,
        locationId: newHouse.id
      }
    })
  ]);

  await prisma.storyPerson.createMany({
    data: [
      { storyId: memoirs[0].id, personId: grandpa.id },
      { storyId: memoirs[1].id, personId: father.id },
      { storyId: memoirs[1].id, personId: mother.id },
      { storyId: memoirs[1].id, personId: me.id }
    ]
  });

  await prisma.storyPhoto.createMany({
    data: [
      { storyId: memoirs[1].id, photoId: photos[3].id },
      { storyId: memoirs[0].id, photoId: photos[4].id }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
