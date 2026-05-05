import { notFound } from "next/navigation";

import { PageHeader } from "@/components/common/page-header";
import { PhotoForm } from "@/components/photos/photo-form";
import { getFormOptions } from "@/server/services/optionsService";
import { getPhotoById } from "@/server/services/photoService";

export default async function EditPhotoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [photo, options] = await Promise.all([getPhotoById(id), getFormOptions()]);

  if (!photo) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <PageHeader title="编辑照片信息" description="补全人物、地点、时间与故事信息，减少待整理内容。" />
      <PhotoForm mode="edit" options={options} initialData={photo} />
    </div>
  );
}
