"use client";

import { useState } from "react";

export default function RequestPanel({
  requestText,
  onSubmit,
  loading,
}: {
  requestText: string;
  onSubmit: (text: string) => void;
  loading: boolean;
}) {
  const [value, setValue] = useState(requestText);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
        Request
      </h2>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={3}
        className="mb-4 w-full resize-none rounded-lg border border-border bg-surface p-3 text-sm outline-none transition focus:border-accent"
      />
      <button
        onClick={() => onSubmit(value)}
        disabled={loading || !value.trim()}
        className="rounded-lg bg-accent px-5 py-2 text-sm font-medium transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? "Processing..." : "Submit Request"}
      </button>
    </div>
  );
}
