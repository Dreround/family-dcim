"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Album,
  Clock3,
  FolderCog,
  Home,
  MapPin,
  Search,
  Sparkles,
  Users,
  Workflow
} from "lucide-react";

import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "首页", icon: Home },
  { href: "/timeline", label: "时间轴", icon: Clock3 },
  { href: "/people", label: "人物", icon: Users },
  { href: "/photos", label: "相册", icon: Album },
  { href: "/family-tree", label: "族谱", icon: Workflow },
  { href: "/locations", label: "地点", icon: MapPin },
  { href: "/pending", label: "待整理", icon: Sparkles },
  { href: "/admin", label: "管理", icon: FolderCog }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-full flex-col rounded-[28px] border border-white/60 bg-white/70 p-5 shadow-paper backdrop-blur">
      <div className="mb-8">
        <p className="font-serif text-2xl text-moss">家庭影像档案馆</p>
        <p className="mt-2 text-sm leading-6 text-clay">
          用照片、人物、地点与家族故事，把家庭记忆整理成可长期传承的档案。
        </p>
      </div>

      <nav className="space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
                active
                  ? "bg-moss text-white shadow-lg"
                  : "text-clay hover:bg-parchment/80 hover:text-moss"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-3xl bg-parchment/90 p-4">
        <div className="flex items-center gap-2 text-moss">
          <Search className="h-4 w-4" />
          <p className="font-medium">整理建议</p>
        </div>
        <p className="mt-2 text-sm leading-6 text-clay">
          优先补充缺少拍摄时间和人物标注的照片，它们最容易在后续检索中失联。
        </p>
      </div>
    </aside>
  );
}
