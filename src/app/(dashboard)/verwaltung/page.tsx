import { requireSession } from "@/core/session";
import { Download } from "lucide-react";
import { VerwaltungTable, VerwaltungRow } from "./components/VerwaltungTable";
import { getDemoChildren } from "@/mock/data";

export default async function VerwaltungPage() {
  const session = await requireSession();

  const children = getDemoChildren()
    .filter((child) => child.organisationId === session.organisationId && child.isActive)
    .sort((a, b) => a.lastName.localeCompare(b.lastName));

  const rows: VerwaltungRow[] = children.map((child) => {
    const primaryPartner =
      child.partners.find((p) => p.isPrimary) || child.partners[0] || null;
    const father =
      child.partners.find((p) => p.relationship === "FATHER" || p.relationship === "VATER") ||
      child.partners[0] ||
      null;
    const mother =
      child.partners.find((p) => p.relationship === "MOTHER" || p.relationship === "MUTTER") ||
      child.partners[1] ||
      null;

    const formatDate = (date: Date | null) =>
      date ? date.toLocaleDateString("de-CH") : "-";

    const groupNames = child.enrollments.map((e) => e.group.name).join(", ");

    const fatherFirst = father?.partner.firstName || "";
    const motherFirst = mother?.partner.firstName || "";
    const fatherLast = father?.partner.lastName || "";
    const motherLast = mother?.partner.lastName || "";

    const searchIndex = [
      child.firstName,
      child.lastName,
      fatherFirst,
      fatherLast,
      motherFirst,
      motherLast,
      primaryPartner?.partner.email || "",
      primaryPartner?.partner.phone || "",
      primaryPartner?.partner.mobile || "",
      groupNames,
      child.dateOfBirth.toLocaleDateString("de-CH"),
      child.entryDate.toLocaleDateString("de-CH"),
      child.exitDate ? child.exitDate.toLocaleDateString("de-CH") : "",
    ]
      .join(" ")
      .toLowerCase();

    return {
      id: child.id,
      childName: `${child.firstName} ${child.lastName}`,
      fatherFirst,
      motherFirst,
      birthDateIso: child.dateOfBirth.toISOString().split("T")[0],
      birthDateDisplay: formatDate(child.dateOfBirth),
      entryDateIso: child.entryDate.toISOString().split("T")[0],
      entryDateDisplay: formatDate(child.entryDate),
      exitDateIso: child.exitDate ? child.exitDate.toISOString().split("T")[0] : null,
      exitDateDisplay: formatDate(child.exitDate),
      primaryEmail: primaryPartner?.partner.email || "",
      primaryPhone: primaryPartner?.partner.phone || primaryPartner?.partner.mobile || "",
      groupNames,
      searchIndex,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Verwaltung</h1>
          <p className="text-gray-600">{children.length} Einträge</p>
        </div>
        <button className="btn btn-outline flex items-center gap-2" disabled>
          <Download className="w-4 h-4" />
          Export (später)
        </button>
      </div>

      <VerwaltungTable rows={rows} />
    </div>
  );
}
