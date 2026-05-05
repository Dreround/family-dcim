"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteButton({
  endpoint,
  redirectTo,
  label
}: {
  endpoint: string;
  redirectTo: string;
  label: string;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function onDelete() {
    const confirmed = window.confirm(`确认要删除“${label}”吗？此操作无法撤销。`);
    if (!confirmed) {
      return;
    }

    setSubmitting(true);
    const response = await fetch(endpoint, {
      method: "DELETE"
    });
    const payload = await response.json();
    setSubmitting(false);

    if (!payload.success) {
      window.alert(payload.error.message);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <button
      type="button"
      disabled={submitting}
      onClick={onDelete}
      className="rounded-2xl border border-red-200 bg-white px-4 py-3 text-sm font-medium text-red-600 disabled:opacity-60"
    >
      {submitting ? "删除中..." : "删除"}
    </button>
  );
}
