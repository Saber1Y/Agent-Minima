export interface ReasonResult {
  reasoning: string;
  minimalClaims: string[];
  excessiveClaims: string[];
  accepted: boolean;
}

export default function ReasonStage({
  result,
  loading,
}: {
  result: ReasonResult | null;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="animate-pulse rounded-lg border border-border bg-card p-4">
        <div className="mb-2 h-4 w-3/4 rounded bg-border" />
        <div className="h-3 w-1/2 rounded bg-border" />
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="mb-3 text-sm leading-relaxed text-muted">{result.reasoning}</p>
      {result.minimalClaims.length > 0 && (
        <div className="mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-success">
            Minimal claims needed:
          </span>
          <div className="mt-1 flex flex-wrap gap-2">
            {result.minimalClaims.map((c) => (
              <span
                key={c}
                className="rounded-md bg-success/10 px-2.5 py-1 text-xs text-success"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      )}
      {result.excessiveClaims.length > 0 && (
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-danger">
            Rejected as excessive:
          </span>
          <div className="mt-1 flex flex-wrap gap-2">
            {result.excessiveClaims.map((c) => (
              <span
                key={c}
                className="rounded-md bg-danger/10 px-2.5 py-1 text-xs text-danger"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
