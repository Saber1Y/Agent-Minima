import { NextRequest, NextResponse } from "next/server";
import { reason } from "@/lib/btl";

export async function POST(req: NextRequest) {
  try {
    const { request } = await req.json();
    if (!request || typeof request !== "string") {
      return NextResponse.json({ error: "missing request field" }, { status: 400 });
    }

    const result = await reason(request);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
