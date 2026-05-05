import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actions
}: {
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-[28px] border border-white/60 bg-white/70 p-6 shadow-paper backdrop-blur lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h1 className="font-serif text-3xl text-moss">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-clay">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}
