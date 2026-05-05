import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { getDashboardData } from "@/server/services/dashboardService";

export default async function AdminPage() {
  const dashboard = await getDashboardData();

  return (
    <div className="space-y-4">
      <PageHeader title="管理与备份" description="查看基础统计、导出当前数据，并为后续对象存储与定时备份保留接入位。" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="照片总数" value={dashboard.stats.photos} unit="张" />
        <StatCard label="人物总数" value={dashboard.stats.people} unit="人" />
        <StatCard label="地点总数" value={dashboard.stats.locations} unit="处" />
        <StatCard label="事件总数" value={dashboard.stats.events} unit="项" />
        <StatCard label="待整理数量" value={dashboard.stats.pending} unit="项" />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-paper">
          <h2 className="font-serif text-2xl text-moss">数据导出</h2>
          <p className="mt-3 text-sm leading-7 text-clay">
            第一版支持导出 JSON，包含照片元数据、人物、关系、事件、地点与家庭大事记，可作为定期离线备份基础。
          </p>
          <a href="/api/export" className="mt-5 inline-flex rounded-2xl bg-moss px-4 py-3 text-sm font-medium text-white">
            导出 JSON 数据
          </a>
        </section>

        <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-paper">
          <h2 className="font-serif text-2xl text-moss">备份预留</h2>
          <p className="mt-3 text-sm leading-7 text-clay">
            后续建议接入对象存储和定时任务：数据库逻辑备份可使用 `pg_dump`，图片文件可同步到 S3/MinIO/OSS/COS，并记录备份时间与校验结果。
          </p>
          <div className="mt-4 rounded-2xl bg-parchment/70 px-4 py-4 text-sm leading-7 text-clay">
            当前版本仅提供 UI 与接口占位，没有真正执行云端上传或定时备份。
          </div>
        </section>
      </div>
    </div>
  );
}
