"use client";

import { useCallback, useState } from "react";
import DemoHeader from "@/components/DemoHeader";
import ScenarioSelector from "@/components/ScenarioSelector";
import RequestPanel from "@/components/RequestPanel";
import FlowTimeline, { type Stage } from "@/components/FlowTimeline";
import type { ReasonResult } from "@/components/ReasonStage";
import type { ProofResult } from "@/components/ProofStage";
import type { ActionResult } from "@/components/ActionStage";

export default function DemoPage() {
  const [scenario, setScenario] = useState("legitimate");
  const [requestText, setRequestText] = useState(
    "Can this user access our DAO governance? I need to verify they are over 18 and hold at least 100 governance tokens."
  );

  const [stage, setStage] = useState<Stage>("idle");
  const [loading, setLoading] = useState(false);

  const [reasonResult, setReasonResult] = useState<ReasonResult | null>(null);
  const [reasonLoading, setReasonLoading] = useState(false);
  const [accepted, setAccepted] = useState<boolean | null>(null);
  const [showCounter, setShowCounter] = useState(false);
  const [proofResult, setProofResult] = useState<ProofResult | null>(null);
  const [proofLoading, setProofLoading] = useState(false);
  const [actionResult, setActionResult] = useState<ActionResult | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleScenario = useCallback((id: string, text: string) => {
    setScenario(id);
    setRequestText(text);
    setStage("idle");
    setReasonResult(null);
    setAccepted(null);
    setShowCounter(false);
    setProofResult(null);
    setActionResult(null);
  }, []);

  const handleSubmit = useCallback(async (text: string) => {
    setLoading(true);
    setStage("reasoning");
    setReasonLoading(true);
    setReasonResult(null);
    setAccepted(null);
    setShowCounter(false);
    setProofResult(null);
    setActionResult(null);

    try {
      const res = await fetch("/api/reason", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request: text }),
      });
      const data: ReasonResult = await res.json();
      setReasonResult(data);
      setReasonLoading(false);
      setStage("deciding");
      setAccepted(data.accepted);

      if (data.accepted) {
        setShowCounter(false);
        await proveAndAct(text);
      } else {
        setShowCounter(true);
      }
    } catch {
      setReasonLoading(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAcceptCounter = useCallback(async () => {
    setShowCounter(false);
    setAccepted(true);
    await proveAndAct(requestText);
  }, [requestText]);

  async function proveAndAct(text: string) {
    setStage("proving");
    setProofLoading(true);
    try {
      const proofRes = await fetch("/api/prove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request: text }),
      });
      const proofData: ProofResult = await proofRes.json();
      setProofResult(proofData);
      setProofLoading(false);

      setStage("acting");
      setActionLoading(true);
      const actionRes = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proofHash: proofData.proofHash }),
      });
      const actionData: ActionResult = await actionRes.json();
      setActionResult(actionData);
      setActionLoading(false);
      setStage("done");
    } catch {
      setProofLoading(false);
      setActionLoading(false);
    }
  }

  const handleReset = useCallback(() => {
    setScenario("legitimate");
    setRequestText(
      "Can this user access our DAO governance? I need to verify they are over 18 and hold at least 100 governance tokens."
    );
    setStage("idle");
    setReasonResult(null);
    setAccepted(null);
    setShowCounter(false);
    setProofResult(null);
    setActionResult(null);
    setLoading(false);
    setReasonLoading(false);
    setProofLoading(false);
    setActionLoading(false);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <DemoHeader onReset={handleReset} />
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
        <ScenarioSelector active={scenario} onSelect={handleScenario} />
        <RequestPanel
          requestText={requestText}
          onSubmit={handleSubmit}
          loading={loading}
        />

        {stage !== "idle" && (
          <FlowTimeline
            stage={stage}
            reasonResult={reasonResult}
            reasonLoading={reasonLoading}
            accepted={accepted}
            onAcceptCounter={handleAcceptCounter}
            showCounter={showCounter}
            proofResult={proofResult}
            proofLoading={proofLoading}
            actionResult={actionResult}
            actionLoading={actionLoading}
          />
        )}
      </main>
    </div>
  );
}
