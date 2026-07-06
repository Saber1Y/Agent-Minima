import { NextRequest, NextResponse } from "next/server";
import { generateProof } from "@/lib/zk";
import { insertEntry } from "@/lib/store";

export async function POST(req: NextRequest) {
  try {
    const { request, decision, disclosedClaims } = await req.json();

    const ageThreshold = 18;
    const tokenThreshold = 100;

    const proof = await generateProof(ageThreshold, tokenThreshold);

    await insertEntry({
      timestamp: new Date().toISOString(),
      request: request || "",
      scenario: request?.includes("email") ? "overbroad" : "legitimate",
      decision: decision || "accepted",
      disclosedClaims: Array.isArray(disclosedClaims) ? disclosedClaims.join(", ") : (disclosedClaims || ""),
      proofHash: proof.proofHash,
      txHash: null,
    });

    return NextResponse.json(proof);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
