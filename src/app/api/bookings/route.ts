import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/core/session";
import { getDemoChildBookings } from "@/mock/data";

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
    const bookings = getDemoChildBookings()
      .filter((booking) => booking.date >= startDate && booking.date <= endDate)
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Bookings GET error:", error);
    return NextResponse.json({ error: "Fehler beim Laden" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireSession();
    const data = await req.json();
    const booking = {
      id: `demo-${Date.now()}`,
      childId: data.childId,
      groupId: data.groupId || null,
      date: new Date(data.date),
      startTime: data.startTime,
      endTime: data.endTime,
      isExtra: Boolean(data.isExtra),
      notes: data.notes || null,
    };

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Bookings POST error:", error);
    return NextResponse.json({ error: "Fehler beim Erstellen" }, { status: 500 });
  }
}
