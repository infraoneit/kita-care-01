"use server";

import { requireSession } from "@/core/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPartner() {
  await requireSession();
  revalidatePath("/partners");
  redirect("/partners");
}

export async function updatePartner(formData: FormData) {
  await requireSession();
  const id = formData.get("id") as string;
  const redirectTo = (formData.get("redirectTo") as string) || "";
  revalidatePath("/partners");
  revalidatePath(`/partners/${id}`);
  if (redirectTo) {
    revalidatePath(redirectTo);
    redirect(redirectTo);
  }
  redirect(`/partners/${id}`);
}

export async function assignChildToPartner(formData: FormData) {
  await requireSession();
  const partnerId = formData.get("partnerId") as string;
  revalidatePath(`/partners/${partnerId}`);
  redirect(`/partners/${partnerId}`);
}

export async function setPrimaryPartner(formData: FormData) {
  await requireSession();
  const childId = formData.get("childId") as string;
  revalidatePath("/verwaltung");
  revalidatePath(`/verwaltung/${childId}`);
  redirect(`/verwaltung/${childId}`);
}

export async function upsertParentContact(formData: FormData) {
  await requireSession();
  const childId = formData.get("childId") as string;
  revalidatePath("/verwaltung");
  revalidatePath(`/verwaltung/${childId}`);
  redirect(`/verwaltung/${childId}`);
}

export async function deletePartner(id: string) {
  await requireSession();
  revalidatePath("/partners");
  redirect("/partners");
}
