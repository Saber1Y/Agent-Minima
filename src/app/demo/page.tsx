"use client";

import { useCallback, useState } from "react";
import DemoHeader from "@/components/DemoHeader";
import ScenarioSelector from "@/components/ScenarioSelector";
import RequestPanel from "@/components/RequestPanel";

export default function DemoPage() {
  const [scenario, setScenario] = useState("legitimate");
  const [requestText, setRequestText] = useState(
    "Can this user access our DAO governance? I need to verify they are over 18 and hold at least 100 governance tokens."
  );
  const [loading, setLoading] = useState(false);

  const handleScenario = useCallback((id: string, text: string) => {
    setScenario(id);
    setRequestText(text);
  }, []);

  const handleSubmit = useCallback(async (text: string) => {
    setLoading(true);
    // TODO: wire to /api/reason
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
  }, []);

  const handleReset = useCallback(() => {
    setScenario("legitimate");
    setRequestText(
      "Can this user access our DAO governance? I need to verify they are over 18 and hold at least 100 governance tokens."
    );
    setLoading(false);
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
      </main>
    </div>
  );
}
