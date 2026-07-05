import Link from "next/link";

export default function DemoHeader({
  onReset,
  address,
  onConnect,
  onLogout,
}: {
  onReset: () => void;
  address: string | null;
  onConnect: () => void;
  onLogout: () => void;
}) {
  return (
    <header className="flex items-center justify-between border-b border-border px-4 py-3 lg:px-6 lg:py-4">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="text-xs text-muted transition hover:text-white font-sans"
        >
          ← Back
        </Link>
        <h1 className="font-sans text-lg font-semibold tracking-tight">
          Minima
          <span className="ml-1.5 text-xs font-normal text-muted">Demo</span>
        </h1>
      </div>
      <div className="flex items-center gap-2">
        {address ? (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-md border border-accent/30 bg-accent/5 px-2.5 py-1 font-mono text-[11px] text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {address.slice(0, 6)}…{address.slice(-4)}
            </span>
            <button
              onClick={onLogout}
              className="rounded-md border border-border px-2 py-1 text-[11px] text-muted transition hover:text-white font-sans"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={onConnect}
            className="rounded-md border border-border px-3 py-1 text-xs text-muted transition hover:border-white hover:text-white font-sans"
          >
            Connect
          </button>
        )}
        <button
          onClick={onReset}
          className="rounded-md border border-border px-2 py-1 text-[11px] text-muted transition hover:text-white font-sans"
        >
          Reset
        </button>
      </div>
    </header>
  );
}
