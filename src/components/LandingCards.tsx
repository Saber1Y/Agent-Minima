const cards = [
  {
    icon: "🧠",
    title: "Selective Attention",
    body: "AI reasons about what claims are truly needed per request, rejecting over-broad demands before any data is disclosed.",
  },
  {
    icon: "🔐",
    title: "Zero-Knowledge Proof",
    body: "Prove age > 18 and token balance > threshold without revealing your actual age or exact balance. Real Noir circuits.",
  },
  {
    icon: "⚡",
    title: "Native Action",
    body: "Once a proof verifies, the agent executes the on-chain action via an ERC-4337 session key — no manual signing required.",
  },
];

export default function LandingCards() {
  return (
    <section className="mx-auto grid max-w-5xl gap-6 px-6 pb-24 sm:grid-cols-3">
      {cards.map((c) => (
        <div
          key={c.title}
          className="rounded-xl border border-border bg-card p-6"
        >
          <div className="mb-3 text-2xl">{c.icon}</div>
          <h3 className="mb-2 text-lg font-semibold">{c.title}</h3>
          <p className="text-muted text-sm leading-relaxed">{c.body}</p>
        </div>
      ))}
    </section>
  );
}
