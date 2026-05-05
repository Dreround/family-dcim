import { notFound } from "next/navigation";

import { PageHeader } from "@/components/common/page-header";
import { PhotoCard } from "@/components/photos/photo-card";
import { getLocationById } from "@/server/services/locationService";

export default async function LocationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const location = await getLocationById(id);

  if (!location) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <PageHeader title={location.name} description="查看地点描述、关联照片、事件和家庭大事记，后续可扩展地图展示。" />

      <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-paper">
        <p className="text-sm leading-7 text-clay">地址：{location.address || "未填写"}</p>
        <p className="mt-3 text-sm leading-7 text-clay">{location.description || "暂无地点说明。"}</p>
      </section>

      <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-paper">
        <h2 className="font-serif text-2xl text-moss">关联照片</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {location.photos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} />
          ))}
        </div>
      </section>
    </div>
  );
}
