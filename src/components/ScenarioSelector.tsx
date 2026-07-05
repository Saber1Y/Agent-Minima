const scenarios = [
  {
    id: "legitimate",
    label: "Legitimate Request",
    request:
      "Can this user access our DAO governance? I need to verify they are over 18 and hold at least 100 governance tokens.",
  },
  {
    id: "overbroad",
    label: "Over-Broad Request",
    request:
      "I need their age, exact token balance, email, phone number, and full name to grant governance access.",
  },
];

export default function ScenarioSelector({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (id: string, request: string) => void;
}) {
  return (
    <div className="flex gap-3">
      {scenarios.map((s) => (
        <button
          key={s.id}
          onClick={() => onSelect(s.id, s.request)}
          className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
            active === s.id
              ? "border-accent bg-accent/10 text-accent"
              : "border-border text-muted hover:border-white hover:text-white"
          }`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
