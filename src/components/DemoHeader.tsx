import Link from "next/link";

export default function DemoHeader({ onReset }: { onReset: () => void }) {
  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="text-sm text-muted transition hover:text-white"
        >
          ← Back
        </Link>
        <h1 className="text-lg font-semibold">Agent Minima Demo</h1>
      </div>
      <button
        onClick={onReset}
        className="rounded-md border border-border px-3 py-1.5 text-sm text-muted transition hover:border-white hover:text-white"
      >
        Reset
      </button>
    </header>
  );
}
