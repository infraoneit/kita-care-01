"use server";

import { requireSession } from "@/core/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createDailyLog(formData: FormData) {
  await requireSession();
  const childId = formData.get("childId") as string;
  revalidatePath("/children");
  revalidatePath("/verwaltung");
  if (childId) revalidatePath(`/verwaltung/${childId}`);
}

export async function deleteDailyLog(formData: FormData) {
  await requireSession();
  const reportId = formData.get("reportId") as string;
  if (reportId) {
    revalidatePath("/children");
    revalidatePath("/verwaltung");
  }
  revalidatePath("/children");
  revalidatePath("/verwaltung");
}

export async function updateChild(formData: FormData) {
  await requireSession();
  const id = formData.get("id") as string;
  const redirectTo = (formData.get("redirectTo") as string) || "";

  revalidatePath(`/children/${id}`);
  revalidatePath("/children");
  revalidatePath("/verwaltung");
  if (redirectTo) {
    revalidatePath(redirectTo);
    redirect(redirectTo);
  }
  redirect(`/children/${id}`);
}

export async function createChild(formData: FormData) {
  await requireSession();
  revalidatePath("/children");
  redirect("/children");
}

export async function deleteChild(id: string) {
  await requireSession();
  revalidatePath("/children");
  redirect("/children");
}
