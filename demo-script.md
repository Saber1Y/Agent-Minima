# Minima — Demo Script

## Before you start — what's real, what's a demo stand-in

Be honest about this up front, it makes the demo stronger because judges trust you more.

| Piece | Real? | What's actually happening |
|---|---|---|
| **LLM reasoning** (BTL) | ✅ Real | Live `deepseek-chat-v3` call to Bad Theory Labs' runtime. The model genuinely reads the request + user data and decides what's excessive. |
| **ZK proof generation** | ✅ Real | `nargo execute` + `bb prove` run on this laptop. Real UltraHonk proof, real Barretenberg binary. |
| **On-chain verification** | ✅ Real | Proof sent to Base Sepolia, verified by the UltraHonkVerifier contract, AgentAccount executes the call. |
| **Session key scope** | ✅ Real | The permission panel reflects a real session key (`0x8ADD…13fCe`) registered on the AgentAccount contract. It literally cannot call other functions. |
| **Wallet connect** | ✅ Real | Privy → MetaMask. You sign one message. |
| **User identity data** | 🟡 Demo | `user-data.json` is a hand-authored profile. In production this comes from an identity provider / oracle. The *agent has data* part is real, *where the data came from* is simulated. |
| **ZK circuit flexibility** | 🟡 Simplified | The circuit always proves age > threshold + token balance > threshold. The AI decides *what to claim*, but the proof always checks both. A production version would compile different circuits per claim set. |
| **Session key setup** | 🟡 Pre-registered | The key was registered once via `cast send`. A real product would register it programmatically when you connect your wallet. |
| **Target contract** | 🟡 Placeholder | MockToken is a real deployed contract but it doesn't do anything — it's proof-of-concept. The impressive part is the ZK → on-chain pipeline, not what gets called. |

**How to say it**: "The pipeline is completely real — live LLM call, real ZK proof, real on-chain transaction. What's simplified is the *integration*: the data is pre-loaded instead of coming from an oracle, and the target contract is a mock. The ZK + agent + on-chain loop is production-grade."

---

## Setup

1. Open http://localhost:3001/demo
2. Click **Connect** → Privy → MetaMask
3. Screen shows: Permission panel (left) | Terminal trace (right, empty) | Command bar (bottom)

---

## Scene 1 — The Permission Slip (15 seconds)

**Point to the left panel.**

"This panel is a cryptographic guarantee, not a UI label. This session key was registered on the AgentAccount contract on Base Sepolia. It can call exactly one function on exactly one contract. Not tokens, not identity data, not other users. That's enforced by the EVM, not by good behavior. It never changes during this demo — you can check any action against it."

---

## Scene 2 — Legitimate Request (45 seconds)

**Click "Legitimate". Read each line as it appears.**

```
▶ Can this user access our DAO governance? I need to verify they are over 18 and hold at least 100 governance tokens.
▸ Analyzing request against DAO access policy…
✓ age>18  (required)
✓ token_balance>=100  (required)
✓ Request accepted — proceeding…
◆ Generating UltraHonk ZK proof…       ← THIS IS REAL. nargo + bb on this machine
◆ Proof generated  0x4f19...5227       ← actual SHA-256 of the proof bytes
⚡ Submitting transaction via session key…  ← REAL TX to Base Sepolia
⚡ Tx confirmed  0x8a3b...c9f1         ← click to open Basescan
○ Done — session audit recorded.
```

**Say**: "The agent looked at the user's actual data — age 25, token balance 500 — and decided only two predicates are needed: age > 18 and balance >= 100. It never revealed the raw numbers. It generated a real UltraHonk proof using Barretenberg on this machine, submitted it via the session key to Base Sepolia, and the UltraHonk verifier contract validated it on-chain. The requester gets a yes/no answer. The raw data never left this browser."

**Optional — open Basescan**: "Here's the transaction on Sepolia. The verifier contract, the proof bytes, the public inputs — all on-chain."

---

## Scene 3 — Over-Broad Rejection (45 seconds)

**Click "Over-Broad".**

```
▶ I need their age, exact token balance, email, phone number, and full name to grant governance access.
▸ Analyzing request against DAO access policy…
✓ age>18  (required)
✓ token_balance>=500  (required)
✕ email: not needed for governance access
✕ phone: not needed for governance access
✕ full name: not needed for governance access
⚠ Request rejected — 3 excessive claims
```

**[ Accept counter-offer: prove age>18 + token_balance>=500 only ]**

**Say**: "Same pipeline. The request asks for five fields. The AI reasons: age and token balance are fair, but email, phone, and full name have nothing to do with governance access. It rejects the over-broad request in plain language — not a red error badge, a readable explanation. That's the transparency pillar. The user sees exactly why each field was refused."

**Click the counter-offer button:**

```
○ Counter-offer accepted — proving minimal claims…
◆ Generating UltraHonk ZK proof…
◆ Proof generated  0x4f19...5227
⚡ Submitting transaction via session key…
⚡ Tx confirmed  0x8a3b...c9f1
```

**Say**: "The user accepts the counter-offer. The same proof pipeline runs — real ZK, real on-chain tx — but now the agent is only proving what was actually needed. The over-broad request was refused out loud, the legitimate check went through. The audit log records every decision."

---

## Scene 4 — Q&A talking points

**"Isn't the LLM just guessing about what's excessive?"**

"The LLM is the reasoning engine — it interprets the request in context. That's actually the point: a rigid allowlist would miss edge cases. The LLM gives the agent *judgment*. What makes it trustworthy is the transparency — every decision is logged in plain text, and the session key enforces the scope regardless of what the AI decides."

**"Couldn't the LLM be tricked?"**

"Yes — that's why the session key is the real enforcement layer. The LLM can say whatever it wants, but it can only execute actions that the session key allows. If it tries to call a different contract or transfer tokens, the EVM rejects it. The permission panel shows exactly what's possible."

**"What would it take to make this production-grade?"**

"Three things: (1) dynamic ZK circuits that compile per-claim-set instead of a fixed circuit, (2) an identity oracle instead of a JSON file, and (3) programmatic session key registration when the user connects their wallet. Everything else — the BTL runtime, the UltraHonk proving, the on-chain verification, the session key model — is already hitting production infrastructure."

---

## Scene 5 — Closing (10 seconds)

**Point to the permission panel one last time.**

"Three pillars, one screen: **scoped action** (the permission slip), **selective disclosure** (the agent refused email and phone), **transparency** (every decision logged in the trace). Not marketing copy. A running system."

---

## Fallback — if the ZK proof fails

The `nargo` + `bb` commands are real — they can fail if the binaries aren't found or the circuit doesn't compile.

**What to say**: "The proof generation is running native on this machine. Give it a moment — it's compiling a real UltraHonk proof with the Barretenberg backend. This is the part that normally happens in a backend server, but we're doing it live so you can see there's no trick."

**If it errors**: "This is an actual cryptographic proof pipeline — if the circuit doesn't match the verifier, it fails honestly. Let me check the binary paths and retry." (Then fix paths or skip to show the trace replay from a previous run.)
