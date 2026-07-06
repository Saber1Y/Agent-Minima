import { NextRequest, NextResponse } from "next/server";
import { executeWithProof, getBalanceOf } from "@/lib/wallet";
import { ethers } from "ethers";

const ACCOUNT_ADDRESS = process.env.AGENT_ACCOUNT_ADDRESS || "";
const TARGET_CONTRACT = process.env.TARGET_CONTRACT || "";

function buildDefaultCalldata(): string {
  const userAddress = process.env.USER_ADDRESS
    ? "0x" + BigInt(process.env.USER_ADDRESS).toString(16).padStart(40, "0")
    : "0x3F5b96A494061F7338Da529e3047809Ac6a7FB84";
  const iface = new ethers.Interface(["function balanceOf(address) view returns (uint256)"]);
  return iface.encodeFunctionData("balanceOf", [userAddress]);
}

export async function POST(req: NextRequest) {
  try {
    const { proofData, publicInputs } = await req.json();
    if (!proofData || !publicInputs) {
      return NextResponse.json({ error: "missing proofData or publicInputs" }, { status: 400 });
    }

    const targetData = process.env.TARGET_DATA || "0x";
    const calldata = targetData === "0x" || !targetData ? buildDefaultCalldata() : targetData;

    const result = await executeWithProof(
      ACCOUNT_ADDRESS,
      proofData,
      publicInputs,
      TARGET_CONTRACT,
      calldata
    );

    const balance = await getBalanceOf(TARGET_CONTRACT, "0x3F5b96A494061F7338Da529e3047809Ac6a7FB84").catch(() => null);

    return NextResponse.json({ ...result, balance });
  } catch (err: unknown) {
    let message = err instanceof Error ? err.message : "unknown error";

    if (err && typeof err === "object" && "code" in err) {
      const rpcErr = err as { code: string; data?: string; reason?: string };
      if (rpcErr.reason) message = rpcErr.reason;
      else if (rpcErr.data) message = `revert: ${rpcErr.data}`;
      else if (rpcErr.code === "CALL_EXCEPTION") message = "on-chain call reverted (proof verification or target call failed)";
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
