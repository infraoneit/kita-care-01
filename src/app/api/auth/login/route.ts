import { NextRequest, NextResponse } from "next/server";
import { demoCredentials } from "@/core/auth";
import { demoUser } from "@/mock/data";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (email !== demoCredentials.email || password !== demoCredentials.password) {
      return NextResponse.json({ error: "Ungültige E-Mail oder Passwort" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    };

    response.cookies.set("userId", demoUser.id, cookieOptions);
    response.cookies.set("organisationId", demoUser.organisationId, cookieOptions);
    response.cookies.set("kita_session", "active", cookieOptions);

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Ein Fehler ist aufgetreten" }, { status: 500 });
  }
}
