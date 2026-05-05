import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-dashed border-clay/25 bg-white/65 p-10 text-center shadow-paper">
      <p className="font-serif text-2xl text-moss">{title}</p>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-clay">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
