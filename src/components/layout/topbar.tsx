"use client";

import { Download, Plus, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("q") ?? "");

  function onSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (keyword.trim()) {
      params.set("q", keyword.trim());
    } else {
      params.delete("q");
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <header className="flex flex-col gap-4 rounded-[28px] border border-white/60 bg-white/70 p-4 shadow-paper backdrop-blur lg:flex-row lg:items-center lg:justify-between">
      <form onSubmit={onSearchSubmit} className="flex flex-1 items-center gap-3 rounded-2xl bg-ivory/80 px-4 py-3">
        <Search className="h-4 w-4 text-clay" />
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          className="w-full bg-transparent text-sm placeholder:text-clay/80"
          placeholder="搜索照片、人物、地点、事件"
        />
      </form>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/photos/upload"
          className="inline-flex items-center gap-2 rounded-2xl bg-moss px-4 py-3 text-sm font-medium text-white"
        >
          <Plus className="h-4 w-4" />
          上传照片
        </Link>
        <a
          href="/api/export"
          className="inline-flex items-center gap-2 rounded-2xl border border-clay/20 bg-white px-4 py-3 text-sm text-clay"
        >
          <Download className="h-4 w-4" />
          导出数据
        </a>
      </div>
    </header>
  );
}
