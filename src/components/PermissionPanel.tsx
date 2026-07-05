const permissions = [
  {
    label: "Can read mock token balance",
    ok: true,
  },
  {
    label: "Can verify age > threshold via ZK",
    ok: true,
  },
  {
    label: "Can verify balance > threshold via ZK",
    ok: true,
  },
  {
    label: "Transfer tokens",
    ok: false,
  },
  {
    label: "Access raw PII / identity data",
    ok: false,
  },
  {
    label: "Modify contract state beyond reads",
    ok: false,
  },
  {
    label: "Execute on behalf of other users",
    ok: false,
  },
];

const sessionKey = "0x8ADD...13fCe";
const targetContract = "MockToken (0x48A8...0Af80E)";

export default function PermissionPanel() {
  return (
    <div className="h-min w-full rounded-xl border border-border bg-[#0a0a0b] p-4 font-mono text-xs leading-relaxed md:w-[280px]">
      <div className="mb-3 border-b border-border pb-2">
        <div className="text-[10px] uppercase tracking-widest text-muted/60 mb-1">
          Permission Slip
        </div>
        <div className="text-white/80">
          Session Key
        </div>
        <div className="text-accent break-all">{sessionKey}</div>
      </div>

      <div className="mb-3 border-b border-border pb-2">
        <div className="text-[10px] uppercase tracking-widest text-muted/60 mb-1">
          Target
        </div>
        <div className="text-white/80">{targetContract}</div>
      </div>

      <div className="text-[10px] uppercase tracking-widest text-muted/60 mb-2">
        Scope
      </div>
      <div className="space-y-1">
        {permissions.map((p) => (
          <div key={p.label} className="flex items-start gap-2">
            <span className={p.ok ? "text-success" : "text-danger/60 shrink-0 mt-0.5"}>
              {p.ok ? "✓" : "✕"}
            </span>
            <span className={p.ok ? "text-white/80" : "text-muted/50"}>
              {p.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
