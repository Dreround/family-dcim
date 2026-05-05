import { notFound } from "next/navigation";

import { PageHeader } from "@/components/common/page-header";
import { PhotoCard } from "@/components/photos/photo-card";
import { formatDate } from "@/lib/utils";
import { getEventById } from "@/server/services/eventService";

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <PageHeader title={event.title} description="按家庭事件聚合照片、地点和说明，形成可回看的事件相册。" />

      <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-paper">
        <p className="text-sm leading-7 text-clay">事件日期：{formatDate(event.eventDate)}</p>
        <p className="mt-2 text-sm leading-7 text-clay">地点：{event.location?.name || "地点待补充"}</p>
        <p className="mt-3 text-sm leading-7 text-clay">{event.description || "暂无事件描述。"}</p>
      </section>

      <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-paper">
        <h2 className="font-serif text-2xl text-moss">关联照片</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {event.photos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} />
          ))}
        </div>
      </section>
    </div>
  );
}
