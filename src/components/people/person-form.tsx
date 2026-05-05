"use client";

import { Gender } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type PersonFormProps = {
  mode: "create" | "edit";
  initialData?: {
    id: string;
    name: string;
    gender?: Gender | null;
    birthDate?: Date | string | null;
    deathDate?: Date | string | null;
    nickname?: string | null;
    relationName?: string | null;
    avatarUrl?: string | null;
    bio?: string | null;
    note?: string | null;
    isSelf: boolean;
  };
};

export function PersonForm({ mode, initialData }: PersonFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(event.currentTarget);
      const body = {
        name: String(formData.get("name") || ""),
        gender: String(formData.get("gender") || "") || null,
        birthDate: String(formData.get("birthDate") || ""),
        deathDate: String(formData.get("deathDate") || ""),
        nickname: String(formData.get("nickname") || ""),
        relationName: String(formData.get("relationName") || ""),
        avatarUrl: String(formData.get("avatarUrl") || ""),
        bio: String(formData.get("bio") || ""),
        note: String(formData.get("note") || ""),
        isSelf: formData.get("isSelf") === "on"
      };
      const url = mode === "create" ? "/api/people" : `/api/people/${initialData?.id}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
      const payload = await response.json();

      if (!payload.success) {
        throw new Error(payload.error.message);
      }

      router.push(`/people/${payload.data.id}`);
      router.refresh();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "提交失败，请稍后重试。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-paper">
      <div className="grid gap-6 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm text-clay">姓名</span>
          <input name="name" defaultValue={initialData?.name} className="w-full rounded-2xl border border-clay/15 bg-ivory/50 px-4 py-3" />
        </label>
        <label className="space-y-2">
          <span className="text-sm text-clay">称谓</span>
          <input
            name="relationName"
            defaultValue={initialData?.relationName ?? ""}
            className="w-full rounded-2xl border border-clay/15 bg-ivory/50 px-4 py-3"
            placeholder="例如：爷爷、妈妈、我"
          />
        </label>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <label className="space-y-2">
          <span className="text-sm text-clay">性别</span>
          <select name="gender" defaultValue={initialData?.gender ?? ""} className="w-full rounded-2xl border border-clay/15 bg-ivory/50 px-4 py-3">
            <option value="">暂不填写</option>
            <option value={Gender.MALE}>男</option>
            <option value={Gender.FEMALE}>女</option>
            <option value={Gender.OTHER}>其他</option>
            <option value={Gender.UNKNOWN}>未知</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm text-clay">出生日期</span>
          <input
            name="birthDate"
            type="date"
            defaultValue={initialData?.birthDate ? new Date(initialData.birthDate).toISOString().slice(0, 10) : ""}
            className="w-full rounded-2xl border border-clay/15 bg-ivory/50 px-4 py-3"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm text-clay">去世日期</span>
          <input
            name="deathDate"
            type="date"
            defaultValue={initialData?.deathDate ? new Date(initialData.deathDate).toISOString().slice(0, 10) : ""}
            className="w-full rounded-2xl border border-clay/15 bg-ivory/50 px-4 py-3"
          />
        </label>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm text-clay">昵称</span>
          <input name="nickname" defaultValue={initialData?.nickname ?? ""} className="w-full rounded-2xl border border-clay/15 bg-ivory/50 px-4 py-3" />
        </label>
        <label className="space-y-2">
          <span className="text-sm text-clay">头像链接</span>
          <input
            name="avatarUrl"
            defaultValue={initialData?.avatarUrl ?? ""}
            className="w-full rounded-2xl border border-clay/15 bg-ivory/50 px-4 py-3"
            placeholder="可先填写现有图片地址，后续可扩展头像上传"
          />
        </label>
      </div>

      <label className="flex items-center gap-3 rounded-2xl border border-clay/15 bg-ivory/40 px-4 py-3 text-sm text-clay">
        <input type="checkbox" name="isSelf" defaultChecked={initialData?.isSelf ?? false} />
        将该人物标记为“当前本人”
      </label>

      <label className="block space-y-2">
        <span className="text-sm text-clay">简介</span>
        <textarea name="bio" defaultValue={initialData?.bio ?? ""} className="min-h-28 w-full rounded-2xl border border-clay/15 bg-ivory/50 px-4 py-3" />
      </label>

      <label className="block space-y-2">
        <span className="text-sm text-clay">备注</span>
        <textarea name="note" defaultValue={initialData?.note ?? ""} className="min-h-24 w-full rounded-2xl border border-clay/15 bg-ivory/50 px-4 py-3" />
      </label>

      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p> : null}

      <button type="submit" disabled={submitting} className="rounded-2xl bg-moss px-5 py-3 text-sm font-medium text-white disabled:opacity-60">
        {submitting ? "提交中..." : mode === "create" ? "保存人物" : "更新人物"}
      </button>
    </form>
  );
}
