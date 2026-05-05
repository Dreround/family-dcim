import Link from "next/link";

import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { formatDate } from "@/lib/utils";
import { listPeople } from "@/server/services/personService";

export default async function PeoplePage() {
  const people = await listPeople();

  return (
    <div className="space-y-4">
      <PageHeader
        title="人物档案"
        description="为家庭成员建立长期档案，并将其与照片、故事和族谱关系关联起来。"
        actions={
          <Link href="/people/new" className="rounded-2xl bg-moss px-4 py-3 text-sm font-medium text-white">
            新增人物
          </Link>
        }
      />

      {people.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {people.map((person) => (
            <Link key={person.id} href={`/people/${person.id}`} className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-paper">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-serif text-2xl text-moss">{person.name}</p>
                  <p className="mt-1 text-sm text-clay">{person.relationName || "家庭成员"}</p>
                </div>
                {person.isSelf ? <span className="rounded-full bg-moss px-3 py-1 text-xs text-white">本人</span> : null}
              </div>
              <p className="mt-4 text-sm leading-7 text-clay">
                出生日期：{person.birthDate ? formatDate(person.birthDate) : "未填写"}
              </p>
              <p className="mt-2 line-clamp-3 text-sm leading-7 text-clay">{person.bio || "还没有填写人物简介。"}</p>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState title="还没有人物档案" description="先新增一位家庭成员，后续就能把照片和人物关系串联起来。" />
      )}
    </div>
  );
}
