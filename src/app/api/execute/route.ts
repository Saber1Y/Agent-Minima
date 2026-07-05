import { NextRequest, NextResponse } from "next/server";
import { executeWithProof } from "@/lib/wallet";

const ACCOUNT_ADDRESS = process.env.AGENT_ACCOUNT_ADDRESS || "";
const TARGET_CONTRACT = process.env.TARGET_CONTRACT || "";
const TARGET_DATA = process.env.TARGET_DATA || "0x";

export async function POST(req: NextRequest) {
  try {
    const { proofData, publicInputs } = await req.json();
    if (!proofData || !publicInputs) {
      return NextResponse.json({ error: "missing proofData or publicInputs" }, { status: 400 });
    }

    const result = await executeWithProof(
      ACCOUNT_ADDRESS,
      proofData,
      publicInputs,
      TARGET_CONTRACT,
      TARGET_DATA
    );

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
