import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", req.url));
  response.cookies.delete("userId");
  response.cookies.delete("organisationId");
  response.cookies.delete("kita_session");
  return response;
}
