import { requireSession } from "@/core/session";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { updateChild } from "@/app/actions/children";
import { setPrimaryPartner, upsertParentContact } from "@/app/actions/partners";
import { DailyStats } from "@/app/(dashboard)/children/[id]/DailyStats";
import { RecentActivity } from "@/app/(dashboard)/children/[id]/RecentActivity";
import { LogDateSelector } from "../components/LogDateSelector";
import { format } from "date-fns";
import { getDemoChildById } from "@/mock/data";

export const dynamic = "force-dynamic";

export default async function VerwaltungDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ logDate?: string }>;
}) {
  const session = await requireSession();
  const { id } = await params;
  const { logDate } = await searchParams;
  if (!id) notFound();
  const logDateKey = logDate || "today";
  const logDateBase = new Date();
  if (logDateKey === "yesterday") {
    logDateBase.setDate(logDateBase.getDate() - 1);
  } else if (logDateKey === "daybefore") {
    logDateBase.setDate(logDateBase.getDate() - 2);
  }
  const logDateString = format(logDateBase, "yyyy-MM-dd");
  // #region agent log
  fetch('http://127.0.0.1:7244/ingest/f6bdf313-ecb7-43ca-a07e-715146912be3', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'verwaltung/[id]/page.tsx:20', message: 'Verwaltung detail date select', data: { logDateKey, logDateString, paramsId: id }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'pre-fix', hypothesisId: 'H2' }) }).catch(() => { });
  // #endregion agent log

  const child = getDemoChildById(id);
  // #region agent log
  fetch('http://127.0.0.1:7244/ingest/f6bdf313-ecb7-43ca-a07e-715146912be3', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'verwaltung/[id]/page.tsx:40', message: 'Verwaltung detail loaded', data: { paramsId: id, childId: child?.id || null, childName: child ? `${child.firstName} ${child.lastName}` : null }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'pre-fix', hypothesisId: 'H4' }) }).catch(() => { });
  // #endregion agent log

  if (!child || child.organisationId !== session.organisationId) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/verwaltung" className="btn btn-ghost btn-circle">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {child.firstName} {child.lastName}
          </h1>
          <p className="text-gray-500">Zentrale Detailansicht (Kind & Vertragspartner)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Kind bearbeiten</h2>
          <form action={updateChild} className="space-y-6">
            <input type="hidden" name="id" value={child.id} />
            <input type="hidden" name="redirectTo" value={`/verwaltung/${child.id}`} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label text-sm font-medium">Vorname</label>
                <input name="firstName" defaultValue={child.firstName} className="input" required />
              </div>
              <div className="form-control">
                <label className="label text-sm font-medium">Nachname</label>
                <input name="lastName" defaultValue={child.lastName} className="input" required />
              </div>
              <div className="form-control">
                <label className="label text-sm font-medium">Geburtsdatum</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  defaultValue={child.dateOfBirth.toISOString().split("T")[0]}
                  className="input"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label text-sm font-medium">Geschlecht</label>
                <select name="gender" defaultValue={child.gender || ""} className="select w-full">
                  <option value="">Bitte wählen</option>
                  <option value="M">Männlich</option>
                  <option value="F">Weiblich</option>
                  <option value="D">Divers</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label text-sm font-medium">Eintrittsdatum</label>
                <input
                  type="date"
                  name="entryDate"
                  defaultValue={child.entryDate.toISOString().split("T")[0]}
                  className="input"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label text-sm font-medium">Austrittsdatum</label>
                <input
                  type="date"
                  name="exitDate"
                  defaultValue={child.exitDate ? child.exitDate.toISOString().split("T")[0] : ""}
                  className="input"
                />
              </div>
            </div>

            <div className="divider">Gesundheit</div>

            <div className="form-control">
              <label className="label text-sm font-medium">Allergien</label>
              <textarea name="allergies" defaultValue={child.allergies || ""} className="textarea h-20" />
            </div>
            <div className="form-control">
              <label className="label text-sm font-medium">Hausarzt Name</label>
              <input name="doctorName" defaultValue={child.doctorInfo?.split(" | ")[0] || ""} className="input" />
            </div>
            <div className="form-control">
              <label className="label text-sm font-medium">Hausarzt Telefon</label>
              <input name="doctorPhone" defaultValue={child.doctorInfo?.split(" | ")[1] || ""} className="input" />
            </div>
            <div className="form-control">
              <label className="label text-sm font-medium">Hausarzt Adresse</label>
              <input name="doctorAddress" defaultValue={child.doctorInfo?.split(" | ")[2] || ""} className="input" />
            </div>
            <div className="form-control">
              <label className="label text-sm font-medium">Besondere Hinweise</label>
              <textarea name="specialNotes" defaultValue={child.specialNotes || ""} className="textarea h-20" />
            </div>

            <div className="divider">Notfallkontakt</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label text-sm font-medium">Name</label>
                <input
                  name="emergencyContactName"
                  defaultValue={child.emergencyContacts[0]?.name || ""}
                  className="input"
                  placeholder="Name Notfallkontakt"
                />
              </div>
              <div className="form-control">
                <label className="label text-sm font-medium">Telefon</label>
                <input
                  name="emergencyContactPhone"
                  defaultValue={child.emergencyContacts[0]?.phone || ""}
                  className="input"
                  placeholder="Telefon"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" className="btn btn-primary">
                <Save className="w-4 h-4 mr-2" />
                Kind speichern
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Hauptkontakt</h2>
            {child.partners.length > 0 ? (
              <form action={setPrimaryPartner} className="flex flex-wrap items-center gap-3">
                <input type="hidden" name="childId" value={child.id} />
                <select
                  name="partnerId"
                  defaultValue={child.partners.find((p) => p.isPrimary)?.partnerId || child.partners[0]?.partnerId}
                  className="select select-sm"
                >
                  {child.partners.map((link) => (
                    <option key={link.id} value={link.partnerId}>
                      {(link.partner.firstName || link.partner.companyName || "").trim() || "Unbekannt"}
                    </option>
                  ))}
                </select>
                <button type="submit" className="btn btn-outline btn-sm">
                  Als Hauptkontakt setzen
                </button>
              </form>
            ) : (
              <p className="text-sm text-gray-500">Keine Vertragspartner verknüpft.</p>
            )}
          </div>

          <div className="card p-6 space-y-6">
            <h2 className="text-lg font-semibold">Vater & Mutter</h2>

            {["FATHER", "MOTHER"].map((role) => {
              const label = role === "FATHER" ? "Vater" : "Mutter";
              const link =
                child.partners.find((p) => p.relationship === role) ||
                child.partners.find((p) =>
                  role === "FATHER" ? p.relationship === "VATER" : p.relationship === "MUTTER"
                );
              return (
                <form
                  key={role}
                  action={upsertParentContact}
                  className="border border-gray-200 rounded-lg p-4 space-y-4"
                >
                  <input type="hidden" name="childId" value={child.id} />
                  <input type="hidden" name="role" value={role} />
                  <div className="text-sm font-medium text-gray-700">{label}</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label text-sm font-medium">Vorname</label>
                      <input name="firstName" defaultValue={link?.partner.firstName || ""} className="input" />
                    </div>
                    <div className="form-control">
                      <label className="label text-sm font-medium">Nachname</label>
                      <input name="lastName" defaultValue={link?.partner.lastName || ""} className="input" />
                    </div>
                    <div className="form-control">
                      <label className="label text-sm font-medium">E-Mail</label>
                      <input name="email" type="email" defaultValue={link?.partner.email || ""} className="input" />
                    </div>
                    <div className="form-control">
                      <label className="label text-sm font-medium">Telefon</label>
                      <input name="phone" defaultValue={link?.partner.phone || ""} className="input" />
                    </div>
                    <div className="form-control">
                      <label className="label text-sm font-medium">Mobil</label>
                      <input name="mobile" defaultValue={link?.partner.mobile || ""} className="input" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="form-control">
                      <label className="label text-sm font-medium">Strasse</label>
                      <input name="address" defaultValue={link?.partner.address || ""} className="input" />
                    </div>
                    <div className="form-control">
                      <label className="label text-sm font-medium">PLZ</label>
                      <input name="zip" defaultValue={link?.partner.zip || ""} className="input" />
                    </div>
                    <div className="form-control">
                      <label className="label text-sm font-medium">Ort</label>
                      <input name="city" defaultValue={link?.partner.city || ""} className="input" />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button type="submit" className="btn btn-outline">
                      {label} speichern
                    </button>
                  </div>
                </form>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Protokoll</label>
                <LogDateSelector current={logDateKey} />
              </div>
              <DailyStats
                key={logDateString}
                childId={child.id}
                selectedDate={logDateString}
                logDateKey={logDateKey}
              />
            </div>
            <RecentActivity childId={child.id} />
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Gruppenzugehörigkeit</h2>
            <div className="flex flex-wrap gap-2">
              {child.enrollments.length > 0 ? (
                child.enrollments.map((e) => (
                  <span key={e.id} className="badge badge-primary badge-outline">
                    {e.group.name}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-500">Keine Gruppe</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
