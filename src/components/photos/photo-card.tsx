import Image from "next/image";
import Link from "next/link";

import { formatDate } from "@/lib/utils";

type PhotoCardProps = {
  photo: {
    id: string;
    title: string;
    fileUrl: string;
    thumbnailUrl: string;
    takenAt?: string | Date | null;
    approximateDateText?: string | null;
    location?: { name: string } | null;
    people?: { person: { id: string; name: string } }[];
  };
};

export function PhotoCard({ photo }: PhotoCardProps) {
  return (
    <Link href={`/photos/${photo.id}`} className="group overflow-hidden rounded-[28px] border border-white/70 bg-white/80 shadow-paper">
      <div className="relative aspect-[4/3] overflow-hidden bg-parchment/50">
        <Image
          src={photo.thumbnailUrl || photo.fileUrl}
          alt={photo.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="space-y-2 p-4">
        <p className="font-medium text-moss">{photo.title}</p>
        <p className="text-sm text-clay">{photo.takenAt ? formatDate(photo.takenAt) : photo.approximateDateText || "时间待确认"}</p>
        <p className="line-clamp-1 text-sm text-clay">
          {photo.location?.name ?? "地点待确认"}
          {photo.people?.length ? ` · ${photo.people.map((item) => item.person.name).join("、")}` : " · 人物待标注"}
        </p>
      </div>
    </Link>
  );
}
