export interface ProofResult {
  proofData: string;
  proofHash: string;
  publicInputs: string[];
}

export default function ProofStage({
  result,
  loading,
}: {
  result: ProofResult | null;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="animate-pulse rounded-lg border border-border bg-card p-4">
        <div className="mb-2 h-4 w-1/2 rounded bg-border" />
        <div className="h-3 w-full rounded bg-border" />
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-lg">🔐</span>
        <span className="text-sm font-semibold">Proof Generated</span>
      </div>
      <div className="mb-2 text-xs">
        <span className="text-muted">Proof hash: </span>
        <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-accent">
          {result.proofHash}
        </code>
      </div>
      {result.publicInputs.length > 0 && (
        <div className="text-xs">
          <span className="text-muted">Public inputs: </span>
          {result.publicInputs.map((p) => (
            <code
              key={p}
              className="mr-1 rounded bg-surface px-1.5 py-0.5 font-mono text-success"
            >
              {p}
            </code>
          ))}
        </div>
      )}
    </div>
  );
}
