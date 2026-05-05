import { formatCount } from "@/lib/utils";

export function StatCard({
  label,
  value,
  unit = "项"
}: {
  label: string;
  value: number;
  unit?: string;
}) {
  return (
    <div className="rounded-[28px] border border-white/70 bg-white/75 p-5 shadow-paper">
      <p className="text-sm text-clay">{label}</p>
      <p className="mt-3 font-serif text-3xl text-moss">{formatCount(value, unit)}</p>
    </div>
  );
}
