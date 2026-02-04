import { NextResponse } from "next/server";
import { requireSession } from "@/core/session";
import { getDemoStaff } from "@/mock/data";

export async function GET() {
  try {
    await requireSession();
    const staff = getDemoStaff()
      .map((member) => ({
        id: member.id,
        firstName: member.firstName,
        lastName: member.lastName,
        position: member.position,
        isActive: member.isActive,
      }))
      .sort((a, b) => a.lastName.localeCompare(b.lastName));
    return NextResponse.json(staff);
  } catch {
    return NextResponse.json({ error: "Fehler beim Laden" }, { status: 500 });
  }
}
