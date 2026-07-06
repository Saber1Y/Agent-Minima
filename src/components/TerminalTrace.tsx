export type LogType =
  | "system"
  | "request"
  | "reason"
  | "accept"
  | "reject"
  | "prove"
  | "action"
  | "error"
  | "warn";

export interface LogEntry {
  id: number;
  timestamp: string;
  type: LogType;
  message: string;
  href?: string;
}

const typeStyles: Record<LogType, string> = {
  system: "text-muted",
  request: "text-white",
  reason: "text-muted",
  accept: "text-success",
  reject: "text-danger",
  prove: "text-accent",
  action: "text-accent-dark",
  error: "text-danger",
  warn: "text-yellow-400",
};

const typeDots: Record<LogType, string> = {
  system: "○",
  request: "▶",
  reason: "▸",
  accept: "✓",
  reject: "✕",
  prove: "◆",
  action: "⚡",
  error: "‼",
  warn: "⚠",
};

export default function TerminalTrace({ entries }: { entries: LogEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-border bg-card/50">
        <span className="text-xs text-muted">Awaiting request…</span>
      </div>
    );
  }

  return (
    <div className="max-h-full overflow-y-auto rounded-xl border border-border bg-[#0a0a0b] p-4 font-mono text-xs leading-relaxed">
      {entries.map((e) => (
        <div key={e.id} className={`flex gap-2 ${typeStyles[e.type]}`}>
          <span className="shrink-0 w-16 text-[10px] text-muted/50">
            {new Date(e.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </span>
          <span className="shrink-0 w-4">{typeDots[e.type]}</span>
          {e.href ? (
            <a
              href={e.href}
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-pre-wrap break-words underline underline-offset-2 decoration-border hover:decoration-accent transition-colors"
            >
              {e.message}
            </a>
          ) : (
            <span className="whitespace-pre-wrap break-words">{e.message}</span>
          )}
        </div>
      ))}
    </div>
  );
}
