"use client";

import { type LogEntry, type LogType } from "./TerminalTrace";

const scenarios = [
  {
    id: "legitimate",
    label: "Legitimate",
    request:
      "Can this user access our DAO governance? I need to verify they are over 18 and hold at least 100 governance tokens.",
  },
  {
    id: "overbroad",
    label: "Over-Broad",
    request:
      "I need their age, exact token balance, email, phone number, and full name to grant governance access.",
  },
];

export default function CommandBar({
  onSend,
  disabled,
}: {
  onSend: (text: string, scenario: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-[#0a0a0b] p-3">
      <div className="flex gap-2">
        {scenarios.map((s) => (
          <button
            key={s.id}
            onClick={() => onSend(s.request, s.id)}
            disabled={disabled}
            className="rounded-md border border-border px-2.5 py-1 text-[11px] text-muted transition hover:border-white hover:text-white disabled:opacity-30"
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type a request…"
          disabled={disabled}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !disabled) {
              const val = (e.target as HTMLInputElement).value.trim();
              if (val) onSend(val, "custom");
              (e.target as HTMLInputElement).value = "";
            }
          }}
          className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 py-2 font-mono text-xs outline-none transition focus:border-accent disabled:opacity-30"
        />
        <button
          onClick={() => {
            const input = document.querySelector<HTMLInputElement>('[placeholder="Type a request…"]');
            if (input && !disabled) {
              const val = input.value.trim();
              if (val) onSend(val, "custom");
              input.value = "";
            }
          }}
          disabled={disabled}
          className="rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-black transition hover:bg-teal-400 disabled:opacity-30"
        >
          Send
        </button>
      </div>
    </div>
  );
}
