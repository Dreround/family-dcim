import { notFound } from "next/navigation";

import { PageHeader } from "@/components/common/page-header";
import { PersonForm } from "@/components/people/person-form";
import { getPersonById } from "@/server/services/personService";

export default async function EditPersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const person = await getPersonById(id);

  if (!person) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <PageHeader title="编辑人物档案" description="维护称谓、简介、备注和当前本人标记等信息。" />
      <PersonForm mode="edit" initialData={person} />
    </div>
  );
}
