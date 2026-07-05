"use client";

import { useCallback, useRef, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import DemoHeader from "@/components/DemoHeader";
import PermissionPanel from "@/components/PermissionPanel";
import TerminalTrace, {
  type LogEntry,
  type LogType,
} from "@/components/TerminalTrace";
import CommandBar from "@/components/CommandBar";

interface ReasonResult {
  reasoning: string;
  minimalClaims: string[];
  excessiveClaims: string[];
  accepted: boolean;
}

interface ProofResult {
  proofData: string;
  proofHash: string;
  publicInputs: string[];
}

interface ActionResult {
  txHash: string;
  explorerUrl: string;
  functionCalled: string;
}

export default function DemoPage() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const address =
    ready && authenticated && user?.wallet?.address
      ? user.wallet.address
      : null;

  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [reasonResult, setReasonResult] = useState<ReasonResult | null>(null);
  const [showCounterOffer, setShowCounterOffer] = useState(false);

  const nextId = useRef(0);

  const addLog = useCallback((type: LogType, message: string) => {
    const id = nextId.current++;
    setEntries((prev) => [
      ...prev,
      { id, timestamp: new Date().toISOString(), type, message },
    ]);
  }, []);

  const proveAndAct = useCallback(
    async (requestText: string, claims: string[]) => {
      addLog("prove", "Generating UltraHonk ZK proof…");
      try {
        const proofRes = await fetch("/api/prove", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            request: requestText,
            decision: "accepted",
            disclosedClaims: claims,
          }),
        });
        const proofData: ProofResult = await proofRes.json();
        addLog("prove", `Proof generated  ${proofData.proofHash}`);
        addLog("system", `Public inputs: ${proofData.publicInputs.join(", ")}`);

        addLog("action", "Submitting transaction via session key…");
        const actionRes = await fetch("/api/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            proofData: proofData.proofData,
            publicInputs: proofData.publicInputs,
          }),
        });
        const actionData: ActionResult = await actionRes.json();
        addLog(
          "action",
          `Tx confirmed  ${actionData.txHash}  (${actionData.functionCalled})`
        );
        addLog("system", "Done — session audit recorded.");
      } catch (err) {
        addLog("error", `Proof/Action failed: ${err}`);
      }
    },
    [addLog]
  );

  const handleSend = useCallback(
    async (text: string, scenario: string) => {
      setLoading(true);
      setShowCounterOffer(false);
      setReasonResult(null);
      setEntries([]);
      nextId.current = 0;

      addLog("request", text);
      addLog("reason", "Analyzing request against DAO access policy…");

      try {
        const res = await fetch("/api/reason", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ request: text }),
        });
        const data: ReasonResult = await res.json();
        setReasonResult(data);

        if (!data.accepted) {
          for (const claim of data.excessiveClaims) {
            addLog("reject", `${claim} — not required`);
          }
          if (data.minimalClaims.length > 0) {
            addLog(
              "reason",
              `Counter-offer: prove ${data.minimalClaims.join(" + ")} only`
            );
          }
          addLog(
            "warn",
            `Request rejected — ${data.excessiveClaims.length} excessive claim${
              data.excessiveClaims.length !== 1 ? "s" : ""
            }`
          );
          setShowCounterOffer(true);
        } else {
          for (const claim of data.minimalClaims) {
            addLog("accept", `${claim}  (required)`);
          }
          addLog("accept", "Request accepted — proceeding…");
          await proveAndAct(text, data.minimalClaims);
        }
      } catch (err) {
        addLog("error", `Reasoning failed: ${err}`);
      }

      setLoading(false);
    },
    [addLog, proveAndAct]
  );

  const handleAcceptCounter = useCallback(async () => {
    if (!reasonResult) return;
    setShowCounterOffer(false);
    addLog("system", "Counter-offer accepted — proving minimal claims…");
    await proveAndAct("", reasonResult.minimalClaims);
  }, [reasonResult, addLog, proveAndAct]);

  const handleReset = useCallback(() => {
    setLoading(false);
    setShowCounterOffer(false);
    setReasonResult(null);
    setEntries([]);
    nextId.current = 0;
  }, []);

  if (!address) {
    return (
      <div className="flex min-h-screen flex-col">
        <DemoHeader
          onReset={handleReset}
          address={address}
          onConnect={login}
          onLogout={logout}
        />
        <main className="flex flex-1 items-center justify-center p-6">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center max-w-md">
            <div className="mb-4 text-3xl">🔑</div>
            <h2 className="font-sans text-lg font-semibold mb-2">
              Connect your wallet
            </h2>
            <p className="font-sans text-sm text-muted mb-6">
              Connect to authorize the agent. You will sign one message to set
              up a session key — after that, Minima handles everything without
              popups.
            </p>
            <button
              onClick={login}
              className="inline-flex items-center px-6 py-3 text-sm font-semibold bg-accent text-black rounded-xl hover:bg-teal-400 transition-all"
            >
              Connect wallet
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DemoHeader
        onReset={handleReset}
        address={address}
        onConnect={login}
        onLogout={logout}
      />

      <div className="flex flex-1 flex-col gap-4 overflow-hidden p-4 lg:flex-row">
        <div className="shrink-0 lg:sticky lg:top-4 lg:self-start">
          <PermissionPanel />
        </div>
        <div className="flex flex-1 flex-col gap-4 overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <TerminalTrace entries={entries} />
            {showCounterOffer && reasonResult && (
              <div className="mt-3 flex justify-center">
                <button
                  onClick={handleAcceptCounter}
                  className="rounded-lg bg-accent px-5 py-2.5 text-xs font-semibold text-black transition hover:bg-teal-400"
                >
                  Accept counter-offer: prove{" "}
                  {reasonResult.minimalClaims.join(", ")} only
                </button>
              </div>
            )}
          </div>
          <div className="shrink-0">
            <CommandBar onSend={handleSend} disabled={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}
