import { requireSession } from "@/core/session";
import { notFound } from "next/navigation";
import { PrintButton } from "./PrintButton";
import { getDemoChildById } from "@/mock/data";

export default async function PrintChildPage({ params }: { params: { id: string } }) {
  const session = await requireSession();

  const child = getDemoChildById(params.id);
  if (!child || child.organisationId !== session.organisationId) notFound();

  return (
    <div className="bg-white min-h-screen p-8 max-w-4xl mx-auto print:p-0 print:max-w-none">
      <div className="flex justify-between items-start mb-8 print:hidden">
        <h1 className="text-2xl font-bold">Stammblatt Druckvorschau</h1>
        <PrintButton />
      </div>

      <div className="space-y-8 print:space-y-6">
        <div className="border-b-2 border-gray-900 pb-4 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Stammblatt</h1>
            <p className="text-gray-600 text-lg">
              {child.firstName} {child.lastName}
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-xl">KitaCare</p>
            <p className="text-sm text-gray-500">Generiert am {new Date().toLocaleDateString("de-CH")}</p>
          </div>
        </div>

        <section>
          <h2 className="text-xl font-bold border-b border-gray-300 mb-4 pb-1">Persönliche Daten</h2>
          <div className="grid grid-cols-2 gap-y-4 gap-x-8">
            <div>
              <span className="block text-sm font-semibold text-gray-500">Vorname / Nachname</span>
              <span className="text-lg">
                {child.firstName} {child.lastName}
              </span>
            </div>
            <div>
              <span className="block text-sm font-semibold text-gray-500">Geschlecht</span>
              <span className="text-lg">
                {child.gender === "MALE" || child.gender === "M"
                  ? "Männlich"
                  : child.gender === "FEMALE" || child.gender === "F"
                  ? "Weiblich"
                  : child.gender === "D"
                  ? "Divers"
                  : "-"}
              </span>
            </div>
            <div>
              <span className="block text-sm font-semibold text-gray-500">Geburtsdatum</span>
              <span className="text-lg">{new Date(child.dateOfBirth).toLocaleDateString("de-CH")}</span>
            </div>
            <div>
              <span className="block text-sm font-semibold text-gray-500">Eintrittsdatum</span>
              <span className="text-lg">{new Date(child.entryDate).toLocaleDateString("de-CH")}</span>
            </div>
            {child.exitDate && (
              <div>
                <span className="block text-sm font-semibold text-gray-500">Austrittsdatum</span>
                <span className="text-lg">{new Date(child.exitDate).toLocaleDateString("de-CH")}</span>
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold border-b border-gray-300 mb-4 pb-1">Vertrag & Gruppen</h2>
          <div className="grid grid-cols-2 gap-y-4 gap-x-8">
            <div>
              <span className="block text-sm font-semibold text-gray-500">Gruppe(n)</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {child.enrollments.length > 0 ? (
                  child.enrollments.map((b: any) => (
                    <span key={b.id} className="border border-gray-400 px-2 py-1 rounded text-sm bg-gray-50">
                      {b.group?.name || "Gruppe"}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">-</span>
                )}
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold border-b border-gray-300 mb-4 pb-1">Medizinische Informationen</h2>
          <div className="space-y-4">
            <div>
              <span className="block text-sm font-semibold text-gray-500">Allergien / Unverträglichkeiten</span>
              <p className="text-lg bg-gray-50 p-3 rounded border border-gray-100 min-h-[3rem]">
                {child.allergies || "Keine bekannt"}
              </p>
            </div>
            <div>
              <span className="block text-sm font-semibold text-gray-500">Hausarzt / Kontakt</span>
              <p className="text-lg bg-gray-50 p-3 rounded border border-gray-100 min-h-[3rem]">
                {child.doctorInfo || "Keine Angabe"}
              </p>
            </div>
            <div>
              <span className="block text-sm font-semibold text-gray-500">Besondere Hinweise</span>
              <p className="text-lg bg-gray-50 p-3 rounded border border-gray-100 min-h-[3rem]">
                {child.specialNotes || "-"}
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold border-b border-gray-300 mb-4 pb-1">Kontakte & Abholung</h2>
          <div className="space-y-4">
            {child.partners.map((p) => (
              <div key={p.id} className="bg-gray-50 p-4 rounded border border-gray-200">
                <p className="font-bold text-lg">
                  {p.partner.firstName} {p.partner.lastName} ({p.relationship})
                </p>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  {p.partner.mobile && <p>📱 {p.partner.mobile}</p>}
                  {p.partner.email && <p>📧 {p.partner.email}</p>}
                </div>
              </div>
            ))}
            {child.emergencyContacts.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Notfallkontakte (außer Eltern):</h3>
                <ul className="list-disc pl-5">
                  {child.emergencyContacts.map((c) => (
                    <li key={c.id}>
                      {c.name} ({c.relationship}): {c.phone}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        <div className="pt-12 mt-12 border-t border-gray-900 text-center text-sm text-gray-500 print:fixed print:bottom-0 print:w-full">
          <p>Dieses Dokument enthält vertrauliche Personendaten. Bitte sicher aufbewahren.</p>
        </div>
      </div>
    </div>
  );
}
