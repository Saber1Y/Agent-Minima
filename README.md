# Minima — Zero-Knowledge Disclosure Agent

**Prove just enough. Reveal nothing else.**

Minima is an AI agent that decides the minimum data a request actually needs, proves it with a zero-knowledge circuit, and executes the approved action on-chain — all without ever exposing the underlying facts.

Built for the [Bad Theory Labs](https://badtheorylabs.com) hackathon.

---

## The problem

Every day, dApps ask for more data than they need. "Connect wallet" becomes "give us your email, phone number, and full name" — even when all they really need is "are you over 18 and do you hold 100 tokens?"

Minima sits between you and those requests. It uses an LLM to reason about what's actually required, generates a ZK proof of only those claims, and executes the action through a scoped session key. The raw data never leaves your agent.

## Architecture

```
User Request
    │
    ▼
┌──────────────────┐
│  BTL Runtime      │  ← LLM reasons: which fields are needed vs excessive
│  (deepseek-chat)  │
└──────┬───────────┘
       │ minimal claims
       ▼
┌──────────────────┐
│  Noir Circuit     │  ← Generates UltraHonk ZK proof locally or from cache
│  (age + balance)  │
└──────┬───────────┘
       │ proof
       ▼
┌──────────────────┐
│  AgentAccount     │  ← Verifies proof on-chain, executes action via session key
│  (Base Sepolia)   │
└──────────────────┘
```

## Three pillars

| Pillar | What it means |
|---|---|
| **Selective disclosure** | Minima's LLM reads your data but only reveals ZK predicates — never raw values. Over-broad requests are rejected with an explanation. |
| **Scoped action** | A pre-registered session key limits the agent to exactly one function on one contract. The EVM enforces this, not good behavior. |
| **Transparency** | Every decision is logged in the terminal trace. Every on-chain action has a Basescan link. The audit trail is public. |

## Demo

Open the app, connect your wallet, and run two scenarios:

**Legitimate request** — "Is this user over 18 with 100+ tokens?" → agent checks your data, finds it reasonable, generates a ZK proof, submits it on-chain ✅

**Over-broad request** — "Give me your age, email, phone number, and full name" → agent rejects the request, explains why each field is excessive, and offers a counter-offer with only the necessary claims ✋

[Watch the demo →](https://sepolia.basescan.org/tx/0x2f0db4069833c08c1ff02147a2a0c07739fe4be14c8b529325b15b4a84232959) (example tx on Base Sepolia)

## Tech stack

| Layer | What |
|---|---|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS |
| **AI reasoning** | [Bad Theory Labs](https://badtheorylabs.com) runtime — `deepseek-chat-v3` |
| **ZK circuit** | Noir language — `agent_minima` circuit proving age + token balance thresholds |
| **Proving backend** | Barretenberg `bb` — UltraHonk proving scheme |
| **Smart contracts** | Solidity + Foundry — ERC-4337 account with session keys + UltraHonk verifier |
| **Chain** | Base Sepolia testnet |
| **Wallet** | Privy — one-click wallet connect |
| **Infrastructure** | Vercel (free) — pre-generated proofs for zero-infra deployment |

## Quick start

### Prerequisites

- Node.js 20+
- [Noir](https://noir-lang.org) + [Barretenberg](https://github.com/AztecProtocol/aztec-packages) (optional — for local proving)
- A [Privy](https://privy.io) app ID
- A [BTL](https://badtheorylabs.com) API key
- Base Sepolia testnet ETH + a deployed AgentAccount (or use ours)

### Setup

```bash
git clone https://github.com/Saber1Y/Agent-Minima
cd Agent-Minima
cp .env.example .env
npm install
```

Edit `.env` with your keys:

| Variable | Where to get it |
|---|---|
| `BTL_API_KEY` | [Bad Theory Labs](https://badtheorylabs.com) dashboard |
| `NEXT_PUBLIC_PRIVY_APP_ID` | [Privy dashboard](https://privy.io) — create an app |
| `AGENT_PRIVATE_KEY` | The session key signer — deploy contracts first |
| `AGENT_ACCOUNT_ADDRESS` | Deployed AgentAccount contract address |

### Run locally

```bash
npm run dev    # opens on http://localhost:3001
```

### Generate ZK proofs (optional — for local proving)

```bash
npm run generate-proofs
```

This runs `nargo execute` + `bb prove` for both demo scenarios and saves the proofs to `data/proofs/`. Without this, the app uses pre-generated proofs from the repo.

## Deployment

Minima deploys on **Vercel free tier** (no credit card required).

1. Push to GitHub
2. Import in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

The ZK proofs are pre-generated and committed — no proving infrastructure needed. The live LLM reasoning and on-chain execution work on Vercel's serverless functions. For full local proving, devs run `npm run generate-proofs` once after cloning.

## Smart contracts

Deployed on **Base Sepolia**:

| Contract | Address |
|---|---|
| **UltraHonkVerifier** | `0x87c90a98fA6b5bcA9a09d0FaE5fB818CCd7b6f8C` |
| **AgentAccount** | `0x4A050e97bBED792b91f72551EE09C18C94FECF92` |
| **MockToken** | `0x48A8d1706Bcd3993E9C4A3d389a1E8F4A30Af80E` |
| **Owner** | `0x3F5b96A494061F7338Da529e3047809Ac6a7FB84` |

Session key `0x8ADD6671F7e4918d5b5D6b2aA9fd6758c4413fCe` is registered on AgentAccount with scope `[MockToken]`.

[View contracts →](https://github.com/Saber1Y/Agent-Minima/tree/main/contracts)

## Project structure

```
├── circuits/            # Noir ZK circuit (agent_minima)
├── contracts/           # Solidity smart contracts (Foundry)
│   ├── src/             # AgentAccount, UltraHonkVerifier, MockToken
│   └── script/          # Deploy & register scripts
├── data/
│   ├── proofs/          # Pre-generated ZK proofs
│   └── user-data.json   # Demo identity profile
├── public/              # Static assets (logo, favicon)
├── scripts/             # Dev utilities (generate-proofs)
├── server/              # Optional proving microservice (Docker)
└── src/
    ├── app/
    │   ├── api/         # Next.js API routes (reason, prove, execute, audit)
    │   ├── demo/        # Demo page (two-column layout)
    │   └── page.tsx     # Landing page
    ├── components/      # UI components
    └── lib/             # Core logic (btl, zk, store, wallet)
```

## License

MIT — built for the Bad Theory Labs hackathon. Experimental prototype, not audited.
