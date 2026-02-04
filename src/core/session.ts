import { cookies } from "next/headers";
import { demoUser } from "@/mock/data";

export interface SessionData {
  userId: string;
  organisationId: string;
  email: string;
  name: string;
  role: string;
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  const organisationId = cookieStore.get("organisationId")?.value;
  const sessionActive = cookieStore.get("kita_session")?.value;

  if (!userId || !organisationId || !sessionActive) {
    return null;
  }

  if (userId !== demoUser.id || organisationId !== demoUser.organisationId) {
    return null;
  }

  return {
    userId: demoUser.id,
    organisationId: demoUser.organisationId,
    email: demoUser.email,
    name: demoUser.name,
    role: demoUser.role,
  };
}

export async function requireSession(): Promise<SessionData> {
  const session = await getSession();
  if (!session) {
    const { redirect } = await import("next/navigation");
    redirect("/login");
    throw new Error("Redirecting to login");
  }
  return session;
}
