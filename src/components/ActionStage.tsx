export interface ActionResult {
  txHash: string;
  explorerUrl: string;
  functionCalled: string;
}

export default function ActionStage({
  result,
  loading,
}: {
  result: ActionResult | null;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="animate-pulse rounded-lg border border-border bg-card p-4">
        <div className="mb-2 h-4 w-1/3 rounded bg-border" />
        <div className="h-3 w-2/3 rounded bg-border" />
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-lg">⚡</span>
        <span className="text-sm font-semibold">Action Executed</span>
      </div>
      <p className="mb-1 text-xs text-muted">
        Function:{" "}
        <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-white">
          {result.functionCalled}
        </code>
      </p>
      <p className="mb-1 text-xs text-muted">
        Tx:{" "}
        <a
          href={result.explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-accent underline underline-offset-2 hover:text-accent-dark"
        >
          {result.txHash.slice(0, 10)}...{result.txHash.slice(-4)}
        </a>
      </p>
    </div>
  );
}
