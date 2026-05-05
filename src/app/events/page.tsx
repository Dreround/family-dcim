import { PageHeader } from "@/components/common/page-header";
import { formatDate } from "@/lib/utils";
import { listEvents } from "@/server/services/eventService";
import Link from "next/link";

export default async function EventsPage() {
  const events = await listEvents();

  return (
    <div className="space-y-4">
      <PageHeader title="事件相册" description="把春节、生日、婚礼、旅行等家庭事件与照片沉淀成可回看的专题记录。" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {events.map((event) => (
          <Link key={event.id} href={`/events/${event.id}`} className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-paper">
            <h2 className="font-serif text-2xl text-moss">{event.title}</h2>
            <p className="mt-2 text-sm text-clay">{formatDate(event.eventDate)}</p>
            <p className="mt-2 text-sm leading-7 text-clay">{event.description || "暂无事件描述"}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-clay">
              <span className="rounded-2xl bg-parchment/70 px-3 py-2">{event.type}</span>
              <span className="rounded-2xl bg-ivory/60 px-3 py-2">{event.location?.name || "地点待补充"}</span>
              <span className="rounded-2xl bg-ivory/60 px-3 py-2">照片 {event.photos.length} 张</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
