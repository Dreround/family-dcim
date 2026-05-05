import Link from "next/link";
import { notFound } from "next/navigation";

import { EmptyState } from "@/components/common/empty-state";
import { DeleteButton } from "@/components/common/delete-button";
import { PageHeader } from "@/components/common/page-header";
import { PhotoCard } from "@/components/photos/photo-card";
import { formatDate } from "@/lib/utils";
import { getPersonById } from "@/server/services/personService";

export default async function PersonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const person = await getPersonById(id);

  if (!person) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title={person.name}
        description="人物档案中集中展示基础信息、照片关联与家族关系。"
        actions={
          <>
            <Link href={`/people/${person.id}/edit`} className="rounded-2xl bg-moss px-4 py-3 text-sm font-medium text-white">
              编辑人物
            </Link>
            <DeleteButton endpoint={`/api/people/${person.id}`} redirectTo="/people" label={person.name} />
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_1.4fr]">
        <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-paper">
          <h2 className="font-serif text-2xl text-moss">人物信息</h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-clay">
            <p>称谓：{person.relationName || "未填写"}</p>
            <p>出生日期：{person.birthDate ? formatDate(person.birthDate) : "未填写"}</p>
            <p>去世日期：{person.deathDate ? formatDate(person.deathDate) : "未填写"}</p>
            <p>昵称：{person.nickname || "未填写"}</p>
          </div>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-clay">{person.bio || "暂无简介。"}</p>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-clay">{person.note || "暂无备注。"}</p>
        </section>

        <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-paper">
          <h2 className="font-serif text-2xl text-moss">家族关系</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {person.relationsFrom.map((relation) => (
              <Link key={relation.id} href={`/people/${relation.toPerson.id}`} className="rounded-2xl bg-ivory/60 px-4 py-3 text-sm text-clay">
                {relation.relationType}：{relation.toPerson.name}
              </Link>
            ))}
            {person.relationsTo.map((relation) => (
              <Link key={relation.id} href={`/people/${relation.fromPerson.id}`} className="rounded-2xl bg-parchment/70 px-4 py-3 text-sm text-clay">
                {relation.relationType}：{relation.fromPerson.name}
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl text-moss">关联照片</h2>
        {person.photos.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {person.photos.map((item) => (
              <PhotoCard key={item.photo.id} photo={item.photo} />
            ))}
          </div>
        ) : (
          <EmptyState title="还没有关联照片" description="到照片详情页手动勾选这位人物，档案里就会自动汇总相关照片。" />
        )}
      </section>
    </div>
  );
}
