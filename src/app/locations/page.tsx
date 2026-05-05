import { PageHeader } from "@/components/common/page-header";
import { listLocations } from "@/server/services/locationService";
import Link from "next/link";

export default async function LocationsPage() {
  const locations = await listLocations();

  return (
    <div className="space-y-4">
      <PageHeader title="地点管理" description="统一记录拍摄地点、地址说明和后续地图展示所需的基础信息。" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {locations.map((location) => (
          <Link key={location.id} href={`/locations/${location.id}`} className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-paper">
            <h2 className="font-serif text-2xl text-moss">{location.name}</h2>
            <p className="mt-2 text-sm leading-7 text-clay">{location.address || "暂未填写地址"}</p>
            <p className="mt-2 text-sm leading-7 text-clay">{location.description || "暂无地点说明"}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-clay">
              <span className="rounded-2xl bg-ivory/60 px-3 py-2">照片 {location.photos.length} 张</span>
              <span className="rounded-2xl bg-parchment/70 px-3 py-2">事件 {location.events.length} 项</span>
              <span className="rounded-2xl bg-ivory/60 px-3 py-2">大事记 {location.memoirs.length} 条</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
