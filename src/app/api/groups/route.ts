import { NextResponse } from "next/server";
import { requireSession } from "@/core/session";
import { getDemoGroups } from "@/mock/data";

export async function GET() {
  try {
    await requireSession();
    const groups = getDemoGroups().slice().sort((a, b) => a.name.localeCompare(b.name));
    return NextResponse.json(groups);
  } catch {
    return NextResponse.json({ error: "Fehler beim Laden" }, { status: 500 });
  }
}
