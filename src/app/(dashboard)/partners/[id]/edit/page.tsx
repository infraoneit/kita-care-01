import { requireSession } from "@/core/session";
import { notFound } from "next/navigation";
import { EditPartnerForm } from "./EditPartnerForm";
import { getDemoPartnerById } from "@/mock/data";

export default async function EditPartnerPage({ params }: { params: { id: string } }) {
  const session = await requireSession();

  const partner = getDemoPartnerById(params.id);

  if (!partner || partner.organisationId !== session.organisationId) notFound();

  return <EditPartnerForm partner={partner} />;
}
