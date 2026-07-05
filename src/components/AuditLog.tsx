"use client";

import { useEffect, useState } from "react";

export interface AuditEntry {
  id: number;
  timestamp: string;
  request: string;
  decision: string;
  disclosedClaims: string[];
  proofHash: string | null;
  txHash: string | null;
  scenario: string;
}

export default function AuditLog({ refreshKey }: { refreshKey: number }) {
  const [entries, setEntries] = useState<AuditEntry[]>([]);

  useEffect(() => {
    fetch("/api/audit")
      .then((r) => r.json())
      .then(setEntries)
      .catch(() => {});
  }, [refreshKey]);

  if (entries.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
        Audit Log
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border text-muted">
              <th className="pb-2 pr-4 font-medium">Time</th>
              <th className="pb-2 pr-4 font-medium">Request</th>
              <th className="pb-2 pr-4 font-medium">Decision</th>
              <th className="pb-2 pr-4 font-medium">Disclosed</th>
              <th className="pb-2 font-medium">Tx</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id} className="border-b border-border/50">
                <td className="py-2 pr-4 text-muted">
                  {new Date(e.timestamp).toLocaleTimeString()}
                </td>
                <td className="max-w-[200px] truncate py-2 pr-4">
                  {e.request}
                </td>
                <td className="py-2 pr-4">
                  <span
                    className={`rounded px-1.5 py-0.5 font-medium ${
                      e.decision === "accepted"
                        ? "bg-success/10 text-success"
                        : "bg-danger/10 text-danger"
                    }`}
                  >
                    {e.decision}
                  </span>
                </td>
                <td className="py-2 pr-4">
                  {e.disclosedClaims.length > 0
                    ? e.disclosedClaims.join(", ")
                    : "—"}
                </td>
                <td className="font-mono py-2">
                  {e.txHash
                    ? `${e.txHash.slice(0, 6)}...${e.txHash.slice(-4)}`
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
