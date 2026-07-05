# Minima — Demo Script

## Setup (prerecorded / before walking on stage)

Screen shows the demo page with **two-column layout**:

- **Left**: Permission panel — session key scope, never changes
- **Right**: Terminal trace — empty, awaiting input
- **Bottom**: Command bar — two scenario buttons + text input

Wallet connected (Privy → MetaMask). Address badge visible in header.

---

## Scene 1 — The Setup

**Narrator**: "Minima is a ZK disclosure agent. You give it your data, it protects it. When someone asks for information, Minima decides — honestly, visibly — what's actually needed and what's excessive."

**On screen**: Pointer to the permission panel on the left.

**Narrator**: "This permission slip never moves. It's the session key's scope — registered on-chain. The agent *cannot* transfer tokens, cannot access raw identity data, cannot do anything beyond what's listed here. That's not a promise — it's a cryptographic fact."

---

## Scene 2 — Legitimate Request

**Action**: Click "Legitimate" scenario button.

**Narrator**: "Let's start simple. A DAO asks: is this user over 18 and holding 100+ governance tokens? Reasonable request."

**Trace populates live**:

```
14:32:01 ▶ Can this user access our DAO governance? I need to verify they are over 18 and hold at least 100 governance tokens.
14:32:03 ▸ Analyzing request against DAO access policy…
14:32:04 ✓ age>18  (required)
14:32:04 ✓ token_balance>=100  (required)
14:32:04 ✓ Request accepted — proceeding…
14:32:06 ◆ Generating UltraHonk ZK proof…
14:32:08 ◆ Proof generated  0x4f19...5227
14:32:09 ⚡ Submitting transaction via session key…
14:32:11 ⚡ Tx confirmed  0x8a3b...c9f1  (verifyProof)
14:32:11 ○ Done — session audit recorded.
```

**Narrator**: "The agent looks at the user's actual data — age 25, balance 500 — but never reveals those raw values. It generates a zero-knowledge proof that *age > 18* and *balance >= 100*, nothing more. The proof lands on Base Sepolia, verified by the UltraHonk verifier contract. The requester gets a yes/no answer. No raw data leaves the agent."

---

## Scene 3 — Over-Broad Request

**Action**: Click "Over-Broad" scenario button.

**Narrator**: "Now let's see what happens when someone asks for too much."

**Trace populates live**:

```
14:35:01 ▶ I need their age, exact token balance, email, phone number, and full name to grant governance access.
14:35:03 ▸ Analyzing request against DAO access policy…
14:35:04 ✓ age>18  (required)
14:35:04 ✓ token_balance>=500  (required)
14:35:04 ✕ email — not needed for governance access
14:35:04 ✕ phone — not needed for governance access
14:35:04 ✕ full name — not needed for governance access
14:35:05 ⚠ Request rejected — 3 excessive claims
```

**Counter-offer button appears**: 「Accept counter-offer: prove age>18 + token_balance>=500 only」

**Narrator**: "The agent reads the request and instantly flags what's excessive. Email, phone, full name — none of those are needed for governance access. It rejects the over-broad request *out loud*, in the trace, in plain language. That's the transparency pillar — the agent doesn't silently comply. It explains its reasoning."

**Action**: Click the counter-offer button.

```
14:35:06 ○ Counter-offer accepted — proving minimal claims…
14:35:06 ◆ Generating UltraHonk ZK proof…
14:35:08 ◆ Proof generated  0x4f19...5227
14:35:09 ⚡ Submitting transaction via session key…
14:35:11 ⚡ Tx confirmed  0x8a3b...c9f1  (verifyProof)
```

**Narrator**: "The user accepts the counter-offer. The agent proves only what's needed — age and token threshold — and executes on-chain. The over-broad request is rejected, the legitimate check goes through, and the audit log records every decision."

---

## Scene 4 — The Architecture (optional deep dive)

Switch to code/architecture view or keep on demo page.

**Narrator**: "Three layers, one pipeline:

1. **Reason** — A deepseek model hosted on Bad Theory Labs' runtime analyzes the request against the user's actual data. It decides what's minimal, what's excessive.
2. **Prove** — Nargo + Barretenberg generate an UltraHonk proof for exactly those claims. No extra data leaks.
3. **Act** — A pre-registered session key submits the proof to the AgentAccount on Base Sepolia. The UltraHonk verifier validates the proof on-chain. If it passes, the action executes. If it doesn't, the transaction reverts.

The session key is scoped to a single contract and function. Even if the agent were compromised, it could only call `MockToken.balanceOf()` — nothing else."

---

## Scene 5 — Closing

**Narrator**: "Most ZK demos show you a proof in a terminal and call it done. Minima shows you why it matters — the moment where an agent *refuses* to share your data, explains why, and proposes a better way. That's selective disclosure in action. That's what makes ZK more than a cryptographic trick — it's a trust mechanism that users can actually see working."

Screen: Point to the permission panel one more time.

**Narrator**: "The permission slip stays on screen the entire demo. Every action the agent takes can be checked against it — live, by anyone watching. That's the triple pillar: **scoped action**, **selective disclosure**, **transparency**. Not as copy on a landing page. As a running system."
