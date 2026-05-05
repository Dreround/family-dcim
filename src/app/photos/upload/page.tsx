import { PageHeader } from "@/components/common/page-header";
import { PhotoForm } from "@/components/photos/photo-form";
import { getFormOptions } from "@/server/services/optionsService";

export default async function UploadPhotoPage() {
  const options = await getFormOptions();

  return (
    <div className="space-y-4">
      <PageHeader title="上传照片" description="上传原图后同步建立数据库记录，并补充时间、地点、事件和人物信息。" />
      <PhotoForm mode="create" options={options} />
    </div>
  );
}
