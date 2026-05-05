import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { EmptyState } from "@/components/common/empty-state";
import { DeleteButton } from "@/components/common/delete-button";
import { PageHeader } from "@/components/common/page-header";
import { formatDateTime } from "@/lib/utils";
import { getPhotoById } from "@/server/services/photoService";

export default async function PhotoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const photo = await getPhotoById(id);

  if (!photo) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title={photo.title}
        description="查看照片的时间、地点、人物、事件与故事说明，并继续补充整理信息。"
        actions={
          <>
            <Link href={`/photos/${photo.id}/edit`} className="rounded-2xl bg-moss px-4 py-3 text-sm font-medium text-white">
              编辑信息
            </Link>
            <DeleteButton endpoint={`/api/photos/${photo.id}`} redirectTo="/photos" label={photo.title} />
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <div className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-paper">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-parchment/40">
            <Image src={photo.fileUrl} alt={photo.title} fill className="object-cover" />
          </div>
        </div>

        <div className="space-y-4">
          <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-paper">
            <h2 className="font-serif text-2xl text-moss">照片信息</h2>
            <div className="mt-4 space-y-3 text-sm leading-7 text-clay">
              <p>拍摄时间：{photo.takenAt ? formatDateTime(photo.takenAt) : photo.approximateDateText || "时间待确认"}</p>
              <p>地点：{photo.location?.name ?? "地点待确认"}</p>
              <p>事件：{photo.event?.title ?? "尚未关联事件"}</p>
              <p>状态：{photo.status}</p>
            </div>
          </section>

          <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-paper">
            <h2 className="font-serif text-2xl text-moss">关联人物</h2>
            {photo.people.length ? (
              <div className="mt-4 flex flex-wrap gap-3">
                {photo.people.map((item) => (
                  <Link key={item.personId} href={`/people/${item.personId}`} className="rounded-2xl bg-ivory/60 px-4 py-2 text-sm text-clay">
                    {item.person.name}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-4">
                <EmptyState title="还没有人物标注" description="进入编辑页手动勾选这张照片中的家庭成员。" />
              </div>
            )}
          </section>
        </div>
      </div>

      <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-paper">
        <h2 className="font-serif text-2xl text-moss">备注与故事</h2>
        <p className="mt-4 text-sm leading-7 text-clay">{photo.description || "暂无备注。"}</p>
        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-clay">{photo.story || "这张照片背后的故事还没有记录。"}</p>
      </section>
    </div>
  );
}
