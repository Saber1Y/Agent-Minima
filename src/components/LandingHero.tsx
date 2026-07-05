import Link from "next/link";

export default function LandingHero() {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center text-center px-6">
      <div className="max-w-3xl">
        <div className="mb-4 inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm text-accent">
          Built for Bad Theory Labs Hackathon
        </div>
        <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
          Your Privacy,
          <span className="text-accent"> Intelligently Gated</span>
        </h1>
        <p className="text-muted mx-auto mb-10 max-w-2xl text-lg leading-relaxed">
          An AI agent that decides what to reveal, proves it without
          over-sharing, and acts on-chain — automatically.
        </p>
        <Link
          href="/demo"
          className="inline-block rounded-lg bg-accent px-8 py-3.5 text-lg font-medium transition hover:bg-accent-dark"
        >
          Enter Demo →
        </Link>
      </div>
    </section>
  );
}
