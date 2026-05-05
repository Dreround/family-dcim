import Link from "next/link";

import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { PhotoCard } from "@/components/photos/photo-card";
import { prisma } from "@/lib/db";
import { listPhotos } from "@/server/services/photoService";

export default async function PhotosPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; status?: any; personId?: string; locationId?: string; eventId?: string; sort?: "asc" | "desc" }>;
}) {
  const params = await searchParams;
  const [photos, people, locations, events] = await Promise.all([
    listPhotos(params),
    prisma.person.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.location.findMany({ orderBy: { name: "asc" } }),
    prisma.familyEvent.findMany({ orderBy: [{ eventDate: "desc" }, { title: "asc" }] })
  ]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="照片管理"
        description="集中维护家庭照片的标题、时间、地点、事件、人物标注与故事说明。"
        actions={
          <Link href="/photos/upload" className="rounded-2xl bg-moss px-4 py-3 text-sm font-medium text-white">
            上传照片
          </Link>
        }
      />

      <div className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-paper">
        <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <input
            name="q"
            defaultValue={params.q ?? ""}
            className="rounded-2xl border border-clay/15 bg-ivory/50 px-4 py-3"
            placeholder="搜索标题、备注、故事"
          />
          <select name="personId" defaultValue={params.personId ?? ""} className="rounded-2xl border border-clay/15 bg-ivory/50 px-4 py-3">
            <option value="">全部人物</option>
            {people.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <select name="locationId" defaultValue={params.locationId ?? ""} className="rounded-2xl border border-clay/15 bg-ivory/50 px-4 py-3">
            <option value="">全部地点</option>
            {locations.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <select name="eventId" defaultValue={params.eventId ?? ""} className="rounded-2xl border border-clay/15 bg-ivory/50 px-4 py-3">
            <option value="">全部事件</option>
            {events.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
          <select name="sort" defaultValue={params.sort ?? "desc"} className="rounded-2xl border border-clay/15 bg-ivory/50 px-4 py-3">
            <option value="desc">按时间倒序</option>
            <option value="asc">按时间正序</option>
          </select>
          <button className="rounded-2xl bg-moss px-4 py-3 text-sm font-medium text-white">应用筛选</button>
        </form>
      </div>

      {photos.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {photos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} />
          ))}
        </div>
      ) : (
        <EmptyState title="还没有照片" description="先上传第一张家庭照片，或调整筛选条件查看已有记录。" />
      )}
    </div>
  );
}
