import { PageHeader } from "@/components/common/page-header";
import { PhotoCard } from "@/components/photos/photo-card";
import { formatDate } from "@/lib/utils";
import { getTimelineData } from "@/server/services/timelineService";

export default async function TimelinePage({
  searchParams
}: {
  searchParams: Promise<{ year?: string }>;
}) {
  const params = await searchParams;
  const groups = await getTimelineData(params.year ? Number(params.year) : undefined);

  return (
    <div className="space-y-4">
      <PageHeader title="家庭时间轴" description="按年份回看家庭照片和大事记，帮助补齐记忆脉络。" />

      <form className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-paper">
        <div className="flex flex-wrap items-center gap-3">
          <input name="year" defaultValue={params.year ?? ""} placeholder="输入年份，例如 2024" className="rounded-2xl border border-clay/15 bg-ivory/50 px-4 py-3" />
          <button className="rounded-2xl bg-moss px-4 py-3 text-sm font-medium text-white">筛选年份</button>
        </div>
      </form>

      <div className="space-y-4">
        {groups.map((group) => (
          <section key={group.year} className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-paper">
            <h2 className="font-serif text-3xl text-moss">{group.year}</h2>
            {group.photos.length ? (
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {group.photos.map((photo) => (
                  <PhotoCard key={photo.id} photo={photo} />
                ))}
              </div>
            ) : null}
            {group.memoirs.length ? (
              <div className="mt-5 space-y-3">
                {group.memoirs.map((memoir) => (
                  <div key={memoir.id} className="rounded-2xl bg-parchment/70 px-4 py-4">
                    <p className="font-medium text-moss">{memoir.title}</p>
                    <p className="mt-1 text-sm text-clay">{formatDate(memoir.date)}</p>
                    <p className="mt-2 text-sm leading-7 text-clay">{memoir.content}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        ))}
      </div>
    </div>
  );
}
