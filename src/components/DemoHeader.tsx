import Link from "next/link";
import { useWallet } from "@/lib/useWallet";

export default function DemoHeader({ onReset }: { onReset: () => void }) {
  const { address, isConnecting, connect } = useWallet();

  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="text-sm text-muted transition hover:text-white"
        >
          ← Back
        </Link>
        <h1 className="text-lg font-semibold">Minima Demo</h1>
      </div>
      <div className="flex items-center gap-3">
        {address ? (
          <span className="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/5 px-3 py-1.5 text-xs font-mono text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        ) : (
          <button
            onClick={connect}
            disabled={isConnecting}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted transition hover:border-white hover:text-white disabled:opacity-50"
          >
            {isConnecting ? "Connecting..." : "Connect wallet"}
          </button>
        )}
        <button
          onClick={onReset}
          className="rounded-md border border-border px-3 py-1.5 text-sm text-muted transition hover:border-white hover:text-white"
        >
          Reset
        </button>
      </div>
    </header>
  );
}
