"use client";

import ReasonStage, { type ReasonResult } from "./ReasonStage";
import DecisionBadge from "./DecisionBadge";
import ProofStage, { type ProofResult } from "./ProofStage";
import ActionStage, { type ActionResult } from "./ActionStage";

export type Stage =
  | "idle"
  | "reasoning"
  | "deciding"
  | "proving"
  | "acting"
  | "done";

const steps = [
  { key: "reason", label: "Reason", icon: "🧠" },
  { key: "decide", label: "Decide", icon: "✅" },
  { key: "prove", label: "Prove", icon: "🔐" },
  { key: "act", label: "Act", icon: "⚡" },
] as const;

export default function FlowTimeline({
  stage,
  reasonResult,
  reasonLoading,
  accepted,
  onAcceptCounter,
  showCounter,
  proofResult,
  proofLoading,
  actionResult,
  actionLoading,
}: {
  stage: Stage;
  reasonResult: ReasonResult | null;
  reasonLoading: boolean;
  accepted: boolean | null;
  onAcceptCounter?: () => void;
  showCounter?: boolean;
  proofResult: ProofResult | null;
  proofLoading: boolean;
  actionResult: ActionResult | null;
  actionLoading: boolean;
}) {
  const stepIndex = steps.findIndex((s) => {
    if (stage === "idle") return -1;
    if (stage === "reasoning") return 0;
    if (stage === "deciding") return 1;
    if (stage === "proving") return 2;
    return 3;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition ${
                i <= stepIndex && stage !== "idle"
                  ? "bg-accent text-white"
                  : "border border-border text-muted"
              }`}
            >
              {i < stepIndex || (i === stepIndex && stage === "done") ? "✓" : s.icon}
            </div>
            <span
              className={`hidden text-xs font-medium sm:inline ${
                i <= stepIndex && stage !== "idle"
                  ? "text-white"
                  : "text-muted"
              }`}
            >
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <div
                className={`h-px w-6 sm:w-12 ${
                  i < stepIndex && stage !== "idle"
                    ? "bg-accent"
                    : "bg-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {(stage === "reasoning" || stage === "deciding" || stage === "proving" || stage === "acting" || stage === "done") && (
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
              Reasoning
            </p>
            <ReasonStage result={reasonResult} loading={reasonLoading} />
          </div>
        )}

        {(stage === "deciding" || stage === "proving" || stage === "acting" || stage === "done") && (
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
              Decision
            </p>
            <DecisionBadge
              accepted={accepted}
              onAcceptCounter={onAcceptCounter}
              showCounter={showCounter}
            />
          </div>
        )}

        {(stage === "proving" || stage === "acting" || stage === "done") && (
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
              Proof
            </p>
            <ProofStage result={proofResult} loading={proofLoading} />
          </div>
        )}

        {(stage === "acting" || stage === "done") && (
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
              Action
            </p>
            <ActionStage result={actionResult} loading={actionLoading} />
          </div>
        )}
      </div>
    </div>
  );
}
