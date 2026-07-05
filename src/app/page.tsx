import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold">Agent Minima</h1>
      <p className="text-muted text-lg">Zero-Knowledge Disclosure Agent</p>
      <Link href="/demo" className="rounded-lg bg-accent px-6 py-3 font-medium hover:bg-accent-dark transition">
        Enter Demo →
      </Link>
    </div>
  );
}
