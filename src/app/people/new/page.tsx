import { PageHeader } from "@/components/common/page-header";
import { PersonForm } from "@/components/people/person-form";

export default function NewPersonPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="新增人物" description="创建家庭成员档案，后续可关联照片、故事和族谱关系。" />
      <PersonForm mode="create" />
    </div>
  );
}
