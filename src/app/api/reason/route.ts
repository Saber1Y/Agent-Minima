import { NextRequest, NextResponse } from "next/server";
import { reason } from "@/lib/btl";
import fs from "fs";
import path from "path";

const USER_DATA_PATH = path.join(process.cwd(), "data", "user-data.json");

function loadUserData(): Record<string, unknown> {
  try {
    const raw = fs.readFileSync(USER_DATA_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export async function POST(req: NextRequest) {
  try {
    const { request } = await req.json();
    if (!request || typeof request !== "string") {
      return NextResponse.json({ error: "missing request field" }, { status: 400 });
    }

    const userData = loadUserData();
    const result = await reason(request, userData);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
