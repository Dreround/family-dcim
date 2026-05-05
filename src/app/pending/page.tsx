import Link from "next/link";
import { PhotoStatus } from "@prisma/client";

import { PageHeader } from "@/components/common/page-header";
import { prisma } from "@/lib/db";

export default async function PendingPage() {
  const [missingDate, missingPeople, missingLocation, pendingConfirmation] = await Promise.all([
    prisma.photo.findMany({ where: { takenAt: null }, orderBy: { createdAt: "desc" } }),
    prisma.photo.findMany({ where: { people: { none: {} } }, orderBy: { createdAt: "desc" } }),
    prisma.photo.findMany({ where: { locationId: null }, orderBy: { createdAt: "desc" } }),
    prisma.photo.findMany({ where: { status: PhotoStatus.PENDING_CONFIRMATION }, orderBy: { createdAt: "desc" } })
  ]);

  const groups = [
    { title: "未填写拍摄时间", photos: missingDate },
    { title: "未关联人物", photos: missingPeople },
    { title: "未填写地点", photos: missingLocation },
    { title: "标记为待确认", photos: pendingConfirmation }
  ];

  return (
    <div className="space-y-4">
      <PageHeader title="待整理中心" description="集中处理缺少拍摄时间、人物、地点和待确认状态的照片。" />
      <div className="grid gap-4 xl:grid-cols-2">
        {groups.map((group) => (
          <section key={group.title} className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-paper">
            <h2 className="font-serif text-2xl text-moss">{group.title}</h2>
            <div className="mt-4 space-y-3">
              {group.photos.map((photo) => (
                <Link key={photo.id} href={`/photos/${photo.id}/edit`} className="block rounded-2xl bg-ivory/60 px-4 py-3">
                  <p className="font-medium text-moss">{photo.title}</p>
                  <p className="mt-1 text-sm text-clay">进入编辑页快速补充信息</p>
                </Link>
              ))}
              {group.photos.length === 0 ? <p className="rounded-2xl bg-parchment/60 px-4 py-3 text-sm text-clay">当前没有待处理内容。</p> : null}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
