export default function DecisionBadge({
  accepted,
  onAcceptCounter,
  showCounter,
}: {
  accepted: boolean | null;
  onAcceptCounter?: () => void;
  showCounter?: boolean;
}) {
  if (accepted === null) return null;

  if (!accepted) {
    return (
      <div className="rounded-lg border border-danger/30 bg-danger/10 p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg">❌</span>
          <span className="font-semibold text-danger">Rejected</span>
        </div>
        <p className="mb-3 text-sm text-muted">
          Request asks for excessive data irrelevant to the access purpose.
        </p>
        {showCounter && onAcceptCounter && (
          <button
            onClick={onAcceptCounter}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium transition hover:bg-accent-dark"
          >
            Accept counter-offer: prove minimal claims only
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-success/30 bg-success/10 p-4">
      <div className="flex items-center gap-2">
        <span className="text-lg">✅</span>
        <span className="font-semibold text-success">Accepted</span>
      </div>
    </div>
  );
}
