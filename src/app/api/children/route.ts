import { NextResponse } from "next/server";
import { requireSession } from "@/core/session";
import { getDemoChildren } from "@/mock/data";

export async function GET() {
  try {
    await requireSession();
    const children = getDemoChildren()
      .map((child) => ({ id: child.id, firstName: child.firstName, lastName: child.lastName }))
      .sort((a, b) => a.lastName.localeCompare(b.lastName));
    return NextResponse.json(children);
  } catch {
    return NextResponse.json({ error: "Fehler beim Laden" }, { status: 500 });
  }
}
