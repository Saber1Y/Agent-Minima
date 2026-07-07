"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("scroll-visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" },
    );

    document
      .querySelectorAll(".scroll-hidden")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent hover:text-white transition-colors"
    >
      {children}
    </a>
  );
}

function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-surface/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <img src="/logo.svg" alt="" className="h-5 w-5" />
          Minima
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-muted">
          <a
            href="#capabilities"
            className="hover:text-white transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="hover:text-white transition-colors"
          >
            How it works
          </a>
          <a
            href="#architecture"
            className="hover:text-white transition-colors"
          >
            Architecture
          </a>
          <a href="#security" className="hover:text-white transition-colors">
            Security
          </a>
        </div>

        <div className="flex items-center gap-3">
          {/* <button className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-muted border border-border rounded-lg hover:text-white hover:border-border/80 transition-all">
            Connect wallet
          </button> */}
          <Link
            href="/demo"
            className="inline-flex items-center px-4 py-2 text-sm font-medium bg-accent text-black rounded-lg hover:bg-teal-400 transition-all"
          >
            Launch app
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="hero-gradient" />
      <div className="hero-grid absolute inset-0 opacity-30" />

      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {/* Circuit grid lines */}
        <svg
          className="absolute w-full h-full opacity-[0.03]"
          viewBox="0 0 800 600"
          preserveAspectRatio="xMidYMid slice"
        >
          <g
            className="circuit-line"
            stroke="#2dd4bf"
            strokeWidth="0.5"
            fill="none"
          >
            <path d="M50,50 L150,50 L200,100 L200,250 L250,300 L350,300 L400,250" />
            <path d="M450,550 L450,450 L400,400 L400,300 L450,250 L550,250 L600,200" />
            <path d="M150,450 L200,400 L300,400 L350,350" />
            <path d="M650,100 L600,100 L550,150 L550,250 L500,300" />
            <path d="M100,550 L150,500 L250,500 L300,450 L350,450" />
            <path d="M300,100 L350,150 L350,200 L400,250" />
            <path d="M600,450 L550,450 L500,400 L450,400" />
          </g>
          <g fill="#2dd4bf" opacity="0.25">
            <circle cx="50" cy="50" r="2" />
            <circle cx="400" cy="250" r="2" />
            <circle cx="450" cy="550" r="2" />
            <circle cx="650" cy="100" r="2" />
            <circle cx="100" cy="550" r="2" />
            <circle cx="300" cy="100" r="1.5" />
            <circle cx="600" cy="450" r="1.5" />
          </g>
        </svg>

        {/* Rotating wireframe ring */}
        <svg
          className="absolute w-[500px] h-[500px] sm:w-[600px] sm:h-[600px] opacity-[0.06]"
          viewBox="0 0 400 400"
          fill="none"
        >
          <g className="hero-ring">
            <ellipse
              cx="200"
              cy="200"
              rx="180"
              ry="60"
              stroke="#2dd4bf"
              strokeWidth="1"
            />
            <ellipse
              cx="200"
              cy="200"
              rx="60"
              ry="180"
              stroke="#2dd4bf"
              strokeWidth="1"
              transform="rotate(30 200 200)"
            />
            <ellipse
              cx="200"
              cy="200"
              rx="180"
              ry="60"
              stroke="#2dd4bf"
              strokeWidth="0.5"
              transform="rotate(60 200 200)"
              opacity="0.5"
            />
          </g>
          <g className="hero-ring-inner">
            <ellipse
              cx="200"
              cy="200"
              rx="120"
              ry="40"
              stroke="#2dd4bf"
              strokeWidth="0.8"
              opacity="0.4"
            />
            <ellipse
              cx="200"
              cy="200"
              rx="40"
              ry="120"
              stroke="#2dd4bf"
              strokeWidth="0.8"
              opacity="0.4"
              transform="rotate(-30 200 200)"
            />
          </g>
        </svg>

        {/* Floating particles */}
        <div
          className="particle"
          style={
            {
              width: 3,
              height: 3,
              background: "#2dd4bf",
              left: "15%",
              top: "25%",
              "--duration": "8s",
              "--delay": "0s",
              "--y1": "-20px",
              "--x1": "15px",
              "--y2": "10px",
              "--x2": "-25px",
              "--y3": "-30px",
              "--x3": "20px",
              "--opacity-start": "0.2",
              "--opacity-mid": "0.5",
            } as React.CSSProperties
          }
        />
        <div
          className="particle"
          style={
            {
              width: 2,
              height: 2,
              background: "#2dd4bf",
              left: "75%",
              top: "60%",
              "--duration": "12s",
              "--delay": "1s",
              "--y1": "-30px",
              "--x1": "-10px",
              "--y2": "20px",
              "--x2": "30px",
              "--y3": "-15px",
              "--x3": "-20px",
              "--opacity-start": "0.15",
              "--opacity-mid": "0.4",
            } as React.CSSProperties
          }
        />
        <div
          className="particle"
          style={
            {
              width: 4,
              height: 4,
              background: "#2dd4bf",
              left: "50%",
              top: "80%",
              "--duration": "10s",
              "--delay": "0.5s",
              "--y1": "-25px",
              "--x1": "20px",
              "--y2": "15px",
              "--x2": "-15px",
              "--y3": "-35px",
              "--x3": "10px",
              "--opacity-start": "0.1",
              "--opacity-mid": "0.35",
            } as React.CSSProperties
          }
        />
        <div
          className="particle"
          style={
            {
              width: 2,
              height: 2,
              background: "#2dd4bf",
              left: "25%",
              top: "70%",
              "--duration": "15s",
              "--delay": "2s",
              "--y1": "-15px",
              "--x1": "-20px",
              "--y2": "25px",
              "--x2": "10px",
              "--y3": "-20px",
              "--x3": "-30px",
              "--opacity-start": "0.2",
              "--opacity-mid": "0.5",
            } as React.CSSProperties
          }
        />
        <div
          className="particle"
          style={
            {
              width: 3,
              height: 3,
              background: "#2dd4bf",
              left: "85%",
              top: "30%",
              "--duration": "9s",
              "--delay": "0.8s",
              "--y1": "-20px",
              "--x1": "10px",
              "--y2": "10px",
              "--x2": "-30px",
              "--y3": "-25px",
              "--x3": "15px",
              "--opacity-start": "0.12",
              "--opacity-mid": "0.4",
            } as React.CSSProperties
          }
        />
        <div
          className="particle"
          style={
            {
              width: 1.5,
              height: 1.5,
              background: "#2dd4bf",
              left: "10%",
              top: "45%",
              "--duration": "11s",
              "--delay": "1.5s",
              "--y1": "-25px",
              "--x1": "25px",
              "--y2": "15px",
              "--x2": "-10px",
              "--y3": "-30px",
              "--x3": "20px",
              "--opacity-start": "0.18",
              "--opacity-mid": "0.45",
            } as React.CSSProperties
          }
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <div className="scroll-hidden">
          <span className="inline-flex items-center px-3 py-1 text-xs font-mono text-accent bg-accent/10 border border-accent/20 rounded-full mb-8">
            Zero-knowledge disclosure agent
          </span>
        </div>

        <h1 className="scroll-hidden text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.1] mb-6">
          Prove just enough.
          <br />
          <span className="text-accent">Reveal nothing else.</span>
        </h1>

        <p className="scroll-hidden text-base sm:text-lg text-muted leading-relaxed max-w-2xl mx-auto mb-8 text-balance">
          Minima decides the minimum data a request actually needs, proves it
          with zero-knowledge, and acts on your behalf — without ever exposing
          the underlying facts.
        </p>

        <div className="scroll-hidden flex flex-wrap justify-center gap-3 mb-10">
          {[
            ["Live on Base Sepolia", "success"],
            ["ERC-4337 session keys", "accent"],
            ["Circom + Groth16", "amber"],
          ].map(([label, color]) => (
            <span
              key={label}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-${color}/5 border border-${color}/20 rounded-full`}
              style={{
                color:
                  color === "success"
                    ? "#22c55e"
                    : color === "accent"
                      ? "#2dd4bf"
                      : "#f59e0b",
                borderColor:
                  color === "success"
                    ? "rgba(34,197,94,0.2)"
                    : color === "accent"
                      ? "rgba(45,212,191,0.2)"
                      : "rgba(245,158,11,0.2)",
                background:
                  color === "success"
                    ? "rgba(34,197,94,0.05)"
                    : color === "accent"
                      ? "rgba(45,212,191,0.05)"
                      : "rgba(245,158,11,0.05)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse-slow"
                style={{
                  background:
                    color === "success"
                      ? "#22c55e"
                      : color === "accent"
                        ? "#2dd4bf"
                        : "#f59e0b",
                  boxShadow:
                    color === "success"
                      ? "0 0 6px rgba(34,197,94,0.6)"
                      : color === "accent"
                        ? "0 0 6px rgba(45,212,191,0.6)"
                        : "0 0 6px rgba(245,158,11,0.6)",
                }}
              />
              {label}
            </span>
          ))}
        </div>

        <div className="scroll-hidden flex flex-wrap justify-center gap-4">
          <Link
            href="/demo"
            className="inline-flex items-center px-6 py-3 text-sm font-semibold bg-accent text-black rounded-xl hover:bg-teal-400 transition-all shadow-lg shadow-accent/20"
          >
            Launch app
          </Link>
          <a
            href="#architecture"
            className="inline-flex items-center px-6 py-3 text-sm font-medium text-muted border border-border rounded-xl hover:text-white hover:border-border/80 transition-all"
          >
            View architecture
          </a>
        </div>
      </div>
    </section>
  );
}

const capabilities = [
  {
    num: "01",
    title: "Minimal by construction",
    body: "Minima's reasoning layer trims every request to only the claims actually required. Nothing more, nothing less.",
    badge: "BTL runtime · reasoning",
    badgeColor: "#2dd4bf",
  },
  {
    num: "02",
    title: "Provable, not promised",
    body: "A Noir circuit proves each claim true without revealing the underlying value. Verification happens on-chain.",
    badge: "Groth16 · zero-knowledge",
    badgeColor: "#2dd4bf",
  },
  {
    num: "03",
    title: "Acts, doesn't just answer",
    body: "A scoped session key lets Minima execute the approved action itself — within the limits you set.",
    badge: "ERC-4337 · session keys",
    badgeColor: "#f59e0b",
  },
  {
    num: "04",
    title: "Self-custody, always",
    body: "Your wallet signs the one-time grant. Minima never holds a master key, and you can revoke at any time.",
    badge: "Non-custodial",
    badgeColor: "#2dd4bf",
  },
];

function Capabilities() {
  return (
    <section id="capabilities" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="scroll-hidden mb-16">
          <span className="text-xs font-mono text-accent tracking-widest uppercase">
            Capabilities
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mt-3">
            What Minima does
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {capabilities.map((c, i) => (
            <div
              key={c.num}
              className="scroll-hidden card-border bg-card rounded-2xl p-6 md:p-8 hover:bg-white/[0.02] transition-colors"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl font-bold text-white/10 font-mono">
                  {c.num}
                </span>
                <span
                  className="px-2.5 py-1 text-[11px] font-mono rounded-full"
                  style={{
                    color: c.badgeColor,
                    border: `1px solid ${c.badgeColor}20`,
                    background: `${c.badgeColor}08`,
                  }}
                >
                  {c.badge}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{c.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      num: 1,
      title: "A request arrives",
      body: 'A dApp, service, or protocol asks for a claim — e.g. "prove age &gt; 18" or "show you hold at least 100 governance tokens."',
    },
    {
      num: 2,
      title: "Minima reasons",
      body: "The agent evaluates every requested field against what's actually needed. Over-broad asks are rejected and counter-offered with the minimal set.",
    },
    {
      num: 3,
      title: "Proof is generated",
      body: "Minima runs the Noir circuit with your private inputs, producing a zero-knowledge proof that only reveals whether each threshold is met — nothing more.",
    },
    {
      num: 4,
      title: "Action executes",
      body: "With the proof verified on-chain, Minima uses its scoped session key to execute the approved action. You sign once, the agent handles the rest.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-24 md:py-32 border-t border-border/50"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="scroll-hidden mb-16">
          <span className="text-xs font-mono text-accent tracking-widest uppercase">
            How it works
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mt-3">
            From request to action
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-6 relative">
          <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-accent/40 via-accent/20 to-transparent" />
          {steps.map((s) => (
            <div key={s.num} className="scroll-hidden relative">
              <div className="w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center mb-5">
                <span className="text-accent font-mono font-semibold">
                  0{s.num}
                </span>
              </div>
              <h3 className="text-base font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const components = [
  {
    name: "Next.js orchestrator",
    status: "live",
    desc: "Agent orchestration & UI",
  },
  {
    name: "BTL runtime",
    status: "live",
    desc: "Reasoning & disclosure decisions",
  },
  {
    name: "Noir proof engine",
    status: "live",
    desc: "ZK circuit compilation & proving",
  },
  {
    name: "ERC-4337 smart account",
    status: "live",
    desc: "Session keys & scoped execution",
  },
  {
    name: "Base Sepolia",
    status: "live",
    desc: "Testnet settlement & verification",
  },
];

function Architecture() {
  return (
    <section
      id="architecture"
      className="py-24 md:py-32 border-t border-border/50"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="scroll-hidden mb-16">
          <span className="text-xs font-mono text-accent tracking-widest uppercase">
            Infrastructure
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mt-3">
            Architecture
          </h2>
        </div>

        <div className="scroll-hidden bg-card border border-border rounded-2xl p-6 md:p-10">
          <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-0">
            {components.map((c, i) => (
              <div
                key={c.name}
                className="flex-1 flex flex-col items-center text-center relative"
              >
                <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center mb-3">
                  <span
                    className={`w-2 h-2 rounded-full ${c.status === "live" ? "bg-success" : "bg-muted"} glow-dot`}
                  />
                </div>
                <span className="text-xs font-semibold mb-1">{c.name}</span>
                <span className="text-[11px] text-muted font-mono">
                  {c.desc}
                </span>
                {i < components.length - 1 && (
                  <div className="hidden md:block absolute top-5 -right-2 text-muted/30 text-lg">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsStrip() {
  return (
    <section className="py-16 border-t border-border/50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-3 gap-8 md:gap-16">
          {[
            { num: "0", label: "raw claims exposed on-chain" },
            { num: "1", label: "signature to set up" },
            { num: "∞", label: "disclosure decisions logged" },
          ].map((s) => (
            <div key={s.label} className="scroll-hidden text-center">
              <div className="text-3xl md:text-5xl font-semibold text-accent mb-2 font-mono">
                {s.num}
              </div>
              <div className="text-xs md:text-sm text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SecuritySection() {
  return (
    <section id="security" className="py-24 md:py-32 border-t border-border/50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="scroll-hidden max-w-3xl">
          <span className="text-xs font-mono text-accent tracking-widest uppercase">
            Security
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mt-3 mb-6">
            Verified, not assumed.
          </h2>

          <div className="space-y-4 text-base text-muted leading-relaxed">
            <p>
              Every claim is proven by a Noir circuit before any action
              executes. The proof is verified on-chain by the{" "}
              <ExternalLink
                href={`https://sepolia.basescan.org/address/${process.env.NEXT_PUBLIC_VERIFIER_ADDRESS || "0x87c90a98fA6b5bcA9a09d0FaE5fB818CCd7b6f8C"}`}
              >
                UltraHonk verifier contract
              </ExternalLink>{" "}
              — deployed and live on Base Sepolia.
            </p>
            <p>
              The session key is scoped by the{" "}
              <ExternalLink
                href={`https://sepolia.basescan.org/address/${process.env.NEXT_PUBLIC_ACCOUNT_ADDRESS || "0x4A050e97bBED792b91f72551EE09C18C94FECF92"}`}
              >
                AgentAccount smart contract
              </ExternalLink>{" "}
              to a single target and a limited action set. Minima can never move
              funds, transfer ownership, or act outside its permission slip.
            </p>
          </div>

          <div className="mt-10 p-4 border border-amber-500/20 bg-amber-500/5 rounded-xl">
            <p className="text-xs font-mono text-amber-400/80 leading-relaxed">
              ⚠ Testnet only. Experimental prototype — not audited. Deployed on
              Base Sepolia. Smart contracts and circuits are provided as-is for
              demonstration purposes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const repos = [
  {
    title: "Noir circuits",
    desc: "ZK circuit for composite age + token threshold proofs using UltraHonk proving system",
    url: "https://github.com/Saber1Y/Agent-Minima/tree/main/circuits",
  },
  {
    title: "Smart contracts",
    desc: "ERC-4337 account with session keys, UltraHonk verifier, and demo ERC-20 token",
    url: "https://github.com/Saber1Y/Agent-Minima/tree/main/contracts",
  },
  {
    title: "Agent orchestrator",
    desc: "Next.js app with BTL runtime integration, proof generation API, and audit logging",
    url: "https://github.com/Saber1Y/Agent-Minima",
  },
];

function OpenSourceSection() {
  return (
    <section className="py-24 md:py-32 border-t border-border/50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="scroll-hidden mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">
            Read the code
          </h2>
          <p className="text-muted text-sm">
            Everything is open source. Inspect the circuits, the contracts, and
            the agent.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {repos.map((r) => (
            <a
              key={r.title}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="scroll-hidden card-border bg-card rounded-xl p-5 hover:bg-white/[0.02] transition-colors group"
            >
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-4 h-4 text-muted group-hover:text-white transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span className="text-sm font-semibold">{r.title}</span>
              </div>
              <p className="text-xs text-muted leading-relaxed">{r.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-sm font-semibold">
              <img src="/logo.svg" alt="" className="h-4 w-4" />
              Minima
            </span>
            <span className="text-xs text-muted hidden sm:inline">
              — Prove just enough. Reveal nothing else.
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-muted">
            <a
              href="#capabilities"
              className="hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-white transition-colors"
            >
              How it works
            </a>
            <a
              href="https://github.com/Saber1Y/Agent-Minima"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-success">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-slow glow-dot" />
            Agent operational
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  useScrollReveal();

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Capabilities />
        <HowItWorks />
        <Architecture />
        <StatsStrip />
        <SecuritySection />
        <OpenSourceSection />
      </main>
      <Footer />
    </>
  );
}
