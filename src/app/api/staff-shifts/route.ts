import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/core/session";
import { getDemoStaffShifts } from "@/mock/data";

export async function GET(req: NextRequest) {
  try {
    await requireSession();
    const { searchParams } = new URL(req.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    if (!start || !end) {
      return NextResponse.json({ error: "start/end erforderlich" }, { status: 400 });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    const shifts = getDemoStaffShifts()
      .filter((shift) => shift.date >= startDate && shift.date <= endDate)
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    return NextResponse.json(shifts);
  } catch (error) {
    console.error("Shifts GET error:", error);
    return NextResponse.json({ error: "Fehler beim Laden" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireSession();
    const data = await req.json();
    const shift = {
      id: `demo-${Date.now()}`,
      staffId: data.staffId,
      groupId: data.groupId || null,
      date: new Date(data.date),
      startTime: data.startTime,
      endTime: data.endTime,
      shiftType: data.shiftType || "FULL_DAY",
      breakMinutes: Number.isFinite(data.breakMinutes) ? data.breakMinutes : 0,
      notes: data.notes || null,
    };

    return NextResponse.json(shift, { status: 201 });
  } catch (error) {
    console.error("Shifts POST error:", error);
    return NextResponse.json({ error: "Fehler beim Erstellen" }, { status: 500 });
  }
}
