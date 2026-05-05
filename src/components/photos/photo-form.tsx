"use client";

import { PhotoStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Option = {
  id: string;
  label: string;
};

type PhotoFormProps = {
  mode: "create" | "edit";
  options: {
    people: Option[];
    locations: Option[];
    events: Option[];
  };
  initialData?: {
    id: string;
    title: string;
    description?: string | null;
    story?: string | null;
    takenAt?: Date | string | null;
    approximateDateText?: string | null;
    fileKey: string;
    fileUrl: string;
    thumbnailUrl: string;
    status: PhotoStatus;
    locationId?: string | null;
    eventId?: string | null;
    people?: { personId: string }[] | { person: { id: string } }[];
  };
};

export function PhotoForm({ mode, options, initialData }: PhotoFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState({
    fileKey: initialData?.fileKey ?? "",
    fileUrl: initialData?.fileUrl ?? "",
    thumbnailUrl: initialData?.thumbnailUrl ?? ""
  });
  const [selectedPeople, setSelectedPeople] = useState<string[]>(
    (initialData?.people ?? []).map((item) => ("personId" in item ? item.personId : item.person.id))
  );

  const statusOptions = useMemo(
    () => [
      { value: PhotoStatus.ORGANIZED, label: "已整理" },
      { value: PhotoStatus.PENDING_CONFIRMATION, label: "待确认" },
      { value: PhotoStatus.PEOPLE_PENDING, label: "人物待标注" },
      { value: PhotoStatus.DATE_PENDING, label: "时间待确认" },
      { value: PhotoStatus.LOCATION_PENDING, label: "地点待确认" }
    ],
    []
  );

  async function handleUpload(file: File | null) {
    if (!file) {
      return uploaded;
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData
    });
    const payload = await response.json();

    if (!payload.success) {
      throw new Error(payload.error.message);
    }

    setUploaded(payload.data);
    return payload.data as typeof uploaded;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(event.currentTarget);
      const fileInput = formData.get("file");

      let currentUpload = uploaded;

      if (mode === "create" && fileInput instanceof File && fileInput.size > 0) {
        currentUpload = await handleUpload(fileInput);
      }

      const body = {
        title: String(formData.get("title") || ""),
        description: String(formData.get("description") || ""),
        story: String(formData.get("story") || ""),
        takenAt: String(formData.get("takenAt") || ""),
        approximateDateText: String(formData.get("approximateDateText") || ""),
        status: String(formData.get("status") || PhotoStatus.PENDING_CONFIRMATION),
        locationId: String(formData.get("locationId") || "") || null,
        eventId: String(formData.get("eventId") || "") || null,
        fileKey: currentUpload.fileKey,
        fileUrl: currentUpload.fileUrl,
        thumbnailUrl: currentUpload.thumbnailUrl,
        people: selectedPeople.map((personId) => ({ personId }))
      };

      if (!body.fileKey || !body.fileUrl || !body.thumbnailUrl) {
        throw new Error("请先上传照片文件。");
      }

      const url = mode === "create" ? "/api/photos" : `/api/photos/${initialData?.id}`;
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

      router.push(`/photos/${payload.data.id}`);
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
          <span className="text-sm text-clay">照片标题</span>
          <input
            name="title"
            defaultValue={initialData?.title}
            className="w-full rounded-2xl border border-clay/15 bg-ivory/50 px-4 py-3"
            placeholder="例如：年夜饭合照"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm text-clay">拍摄日期</span>
          <input
            name="takenAt"
            type="date"
            defaultValue={initialData?.takenAt ? new Date(initialData.takenAt).toISOString().slice(0, 10) : ""}
            className="w-full rounded-2xl border border-clay/15 bg-ivory/50 px-4 py-3"
          />
        </label>
      </div>

      {mode === "create" ? (
        <label className="block space-y-2">
          <span className="text-sm text-clay">上传原图</span>
          <input
            name="file"
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            className="w-full rounded-2xl border border-clay/15 bg-ivory/50 px-4 py-3"
          />
          <p className="text-xs text-clay">仅支持 jpg、jpeg、png、webp，单张不超过 20MB。</p>
        </label>
      ) : null}

      <div className="grid gap-6 md:grid-cols-3">
        <label className="space-y-2">
          <span className="text-sm text-clay">状态</span>
          <select
            name="status"
            defaultValue={initialData?.status ?? PhotoStatus.PENDING_CONFIRMATION}
            className="w-full rounded-2xl border border-clay/15 bg-ivory/50 px-4 py-3"
          >
            {statusOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm text-clay">地点</span>
          <select
            name="locationId"
            defaultValue={initialData?.locationId ?? ""}
            className="w-full rounded-2xl border border-clay/15 bg-ivory/50 px-4 py-3"
          >
            <option value="">暂不填写</option>
            {options.locations.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm text-clay">事件</span>
          <select
            name="eventId"
            defaultValue={initialData?.eventId ?? ""}
            className="w-full rounded-2xl border border-clay/15 bg-ivory/50 px-4 py-3"
          >
            <option value="">暂不填写</option>
            {options.events.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm text-clay">大约时间说明</span>
        <input
          name="approximateDateText"
          defaultValue={initialData?.approximateDateText ?? ""}
          className="w-full rounded-2xl border border-clay/15 bg-ivory/50 px-4 py-3"
          placeholder="例如：大约 1998 年夏天"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm text-clay">照片备注</span>
        <textarea
          name="description"
          defaultValue={initialData?.description ?? ""}
          className="min-h-24 w-full rounded-2xl border border-clay/15 bg-ivory/50 px-4 py-3"
          placeholder="记录拍摄场景、人物状态或需要补充的信息"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm text-clay">故事说明</span>
        <textarea
          name="story"
          defaultValue={initialData?.story ?? ""}
          className="min-h-32 w-full rounded-2xl border border-clay/15 bg-ivory/50 px-4 py-3"
          placeholder="写下照片背后的家族故事，方便以后回看与传承"
        />
      </label>

      <div className="space-y-3">
        <p className="text-sm text-clay">关联人物</p>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {options.people.map((person) => {
            const checked = selectedPeople.includes(person.id);
            return (
              <label
                key={person.id}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${checked ? "border-moss bg-moss/5" : "border-clay/15 bg-ivory/40"}`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(event) => {
                    setSelectedPeople((current) =>
                      event.target.checked ? [...current, person.id] : current.filter((item) => item !== person.id)
                    );
                  }}
                />
                <span>{person.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={submitting} className="rounded-2xl bg-moss px-5 py-3 text-sm font-medium text-white disabled:opacity-60">
          {submitting ? "提交中..." : mode === "create" ? "保存照片" : "更新信息"}
        </button>
      </div>
    </form>
  );
}
