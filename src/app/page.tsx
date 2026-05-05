import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { PhotoCard } from "@/components/photos/photo-card";
import { StatCard } from "@/components/common/stat-card";
import { formatDate } from "@/lib/utils";
import { headers } from "next/headers";
import Link from "next/link";

async function getDashboard() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? (host ? `${protocol}://${host}` : "");

  const response = await fetch(`${baseUrl}/api/dashboard`, {
    cache: "no-store"
  }).catch(() => null);

  if (!response?.ok) {
    return null;
  }

  const payload = await response.json();
  return payload.success ? payload.data : null;
}

export default async function HomePage() {
  const dashboard = await getDashboard();

  if (!dashboard) {
    return (
      <EmptyState
        title="仪表盘暂时无法加载"
        description="当前环境还没有可用的数据源或服务尚未启动。完成数据库迁移与种子数据导入后，这里会展示最近照片、时间轴预览和家族成员概览。"
        action={
          <Link href="/photos/upload" className="rounded-2xl bg-moss px-4 py-3 text-sm font-medium text-white">
            先上传一张家庭照片吧
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="家庭影像档案馆"
        description="把照片、人物、地点、事件和故事串成一条可以长期保存、持续补充的家庭记忆脉络。"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="照片总数" value={dashboard.stats.photos} unit="张" />
        <StatCard label="人物档案" value={dashboard.stats.people} unit="人" />
        <StatCard label="地点记录" value={dashboard.stats.locations} unit="处" />
        <StatCard label="家庭事件" value={dashboard.stats.events} unit="项" />
        <StatCard label="待整理内容" value={dashboard.stats.pending} unit="项" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
        <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-paper">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-serif text-2xl text-moss">最近照片</h2>
            <Link href="/photos" className="text-sm text-clay">
              查看全部
            </Link>
          </div>
          {dashboard.recentPhotos.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {dashboard.recentPhotos.map((photo: any) => (
                <PhotoCard key={photo.id} photo={photo} />
              ))}
            </div>
          ) : (
            <EmptyState title="还没有照片" description="先上传一张家庭照片，首页就会开始形成你的家庭影像档案。" />
          )}
        </section>

        <section className="space-y-4">
          <div className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-paper">
            <h2 className="font-serif text-2xl text-moss">人物档案预览</h2>
            <div className="mt-4 space-y-3">
              {dashboard.peoplePreview.map((person: any) => (
                <Link key={person.id} href={`/people/${person.id}`} className="flex items-center justify-between rounded-2xl bg-ivory/60 px-4 py-3">
                  <div>
                    <p className="font-medium text-moss">{person.name}</p>
                    <p className="text-sm text-clay">{person.relationName || "家庭成员"}</p>
                  </div>
                  <span className="text-xs text-clay">{person.isSelf ? "本人" : "查看"}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-paper">
            <h2 className="font-serif text-2xl text-moss">待整理入口</h2>
            <div className="mt-4 space-y-3">
              {dashboard.pendingPreview.map((photo: any) => (
                <Link key={photo.id} href={`/photos/${photo.id}/edit`} className="block rounded-2xl bg-parchment/70 px-4 py-3">
                  <p className="font-medium text-moss">{photo.title}</p>
                  <p className="mt-1 text-sm text-clay">进入补充时间、人物或地点信息</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-paper">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl text-moss">时间轴预览</h2>
            <Link href="/timeline" className="text-sm text-clay">
              查看时间轴
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {dashboard.recentPhotos.slice(0, 4).map((photo: any) => (
              <div key={photo.id} className="rounded-2xl bg-ivory/60 px-4 py-3">
                <p className="font-medium text-moss">{photo.title}</p>
                <p className="mt-1 text-sm text-clay">{formatDate(photo.takenAt)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-paper">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl text-moss">家族族谱预览</h2>
            <Link href="/family-tree" className="text-sm text-clay">
              查看族谱
            </Link>
          </div>
          <p className="mt-4 text-sm leading-7 text-clay">
            当前版本支持父母、配偶、自身等基础关系。后续可平滑扩展为更复杂的族谱布局与交互。
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {dashboard.peoplePreview.slice(0, 4).map((person: any) => (
              <span key={person.id} className="rounded-2xl bg-parchment/70 px-4 py-2 text-sm text-clay">
                {person.relationName || "成员"} · {person.name}
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-paper">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl text-moss">家庭大事记</h2>
            <Link href="/timeline" className="text-sm text-clay">
              在时间轴中查看
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {dashboard.memoirPreview.map((memoir: any) => (
              <div key={memoir.id} className="rounded-2xl bg-ivory/60 px-4 py-3">
                <p className="font-medium text-moss">{memoir.title}</p>
                <p className="mt-1 text-sm text-clay">{formatDate(memoir.date)}</p>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-clay">{memoir.content}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
