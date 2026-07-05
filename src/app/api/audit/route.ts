import { NextResponse } from "next/server";
import { getAllEntries } from "@/lib/store";

export async function GET() {
  try {
    const entries = getAllEntries();
    return NextResponse.json(entries);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
