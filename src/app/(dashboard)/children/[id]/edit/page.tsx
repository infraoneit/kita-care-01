import { requireSession } from "@/core/session";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { updateChild } from "@/app/actions/children";
import { EmergencyContactEditor } from "./EmergencyContactEditor";
import { getDemoChildById } from "@/mock/data";

export default async function EditChildPage({ params }: { params: { id: string } }) {
  const session = await requireSession();

  const child = getDemoChildById(params.id);
  if (!child || child.organisationId !== session.organisationId) notFound();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/children/${child.id}`} className="btn btn-ghost btn-circle">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Kind bearbeiten</h1>
      </div>

      <div className="card p-6">
        <form action={updateChild} className="space-y-6">
          <input type="hidden" name="id" value={child.id} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label text-sm font-medium">Vorname</label>
              <input type="text" name="firstName" defaultValue={child.firstName} className="input" required />
            </div>

            <div className="form-control">
              <label className="label text-sm font-medium">Nachname</label>
              <input type="text" name="lastName" defaultValue={child.lastName} className="input" required />
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
          </div>

          <div className="divider">Vertragsdaten</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <label className="label text-sm font-medium">Austrittsdatum (Optional)</label>
              <input
                type="date"
                name="exitDate"
                defaultValue={child.exitDate ? child.exitDate.toISOString().split("T")[0] : ""}
                className="input"
              />
            </div>
          </div>

          <div className="divider">Medizinische Infos</div>

          <div className="form-control">
            <label className="label text-sm font-medium">Allergien / Unverträglichkeiten</label>
            <textarea
              name="allergies"
              defaultValue={child.allergies || ""}
              className="textarea h-24"
              placeholder="z.B. Erdnüsse, Laktose..."
            />
          </div>

          <div className="form-control">
            <label className="label text-sm font-medium">Hausarzt / Medizinische Kontakte</label>
            <textarea
              name="doctorInfo"
              defaultValue={child.doctorInfo || ""}
              className="textarea h-24"
              placeholder="Name, Telefon, Adresse..."
            />
          </div>

          <div className="form-control">
            <label className="label text-sm font-medium">Besondere Hinweise</label>
            <textarea
              name="specialNotes"
              defaultValue={child.specialNotes || ""}
              className="textarea h-24"
              placeholder="Sonstige wichtige Infos..."
            />
          </div>

          <div className="divider">Notfallkontakte</div>

          <EmergencyContactEditor
            initialContacts={child.emergencyContacts.map((c) => ({
              name: c.name,
              relationship: c.relationship,
              phone: c.phone,
            }))}
          />

          <div className="flex justify-end gap-4 pt-4">
            <Link href={`/children/${child.id}`} className="btn btn-ghost">
              Abbrechen
            </Link>
            <button type="submit" className="btn btn-primary">
              <Save className="w-4 h-4 mr-2" />
              Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
