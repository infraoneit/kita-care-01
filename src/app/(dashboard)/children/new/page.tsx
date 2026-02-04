"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Save, Link as LinkIcon } from "lucide-react";
import { createChild } from "@/app/actions/children";
import { getDemoPartnerById } from "@/mock/data";

export default function NewChildPage() {
  return (
    <Suspense fallback={<div>Laden...</div>}>
      <NewChildForm />
    </Suspense>
  );
}

function NewChildForm() {
  const searchParams = useSearchParams();
  const partnerId = searchParams.get("partnerId");

  const [loading, setLoading] = useState(false);
  const [parents, setParents] = useState([
    {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      isPrimary: true,
      createPartner: true,
      existingPartnerId: null as string | null,
    },
  ]);
  const [contacts, setContacts] = useState([{ name: "", relationship: "", phone: "" }]);

  useEffect(() => {
    function loadPartner() {
      if (partnerId) {
        const partner = getDemoPartnerById(partnerId);
        if (partner) {
          setParents([
            {
              firstName: partner.firstName || partner.companyName || "",
              lastName: partner.lastName || "",
              phone: partner.phone || partner.mobile || "",
              email: partner.email || "",
              isPrimary: true,
              createPartner: true,
              existingPartnerId: partner.id,
            },
          ]);
        }
      }
    }
    loadPartner();
  }, [partnerId]);

  const handleAddParent = () => {
    setParents([
      ...parents,
      { firstName: "", lastName: "", phone: "", email: "", isPrimary: false, createPartner: true, existingPartnerId: null },
    ]);
  };

  const handleRemoveParent = (index: number) => {
    const newParents = parents.filter((_, i) => i !== index);
    if (newParents.length === 1) {
      newParents[0].isPrimary = true;
    }
    setParents(newParents);
  };

  const handleParentChange = (index: number, field: string, value: any) => {
    const newParents = [...parents];
    // @ts-ignore
    newParents[index][field] = value;

    if (field === "isPrimary" && value === true) {
      newParents.forEach((p, i) => {
        if (i !== index) p.isPrimary = false;
      });
    }
    setParents(newParents);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/children" className="btn btn-ghost btn-circle">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Neues Kind</h1>
      </div>

      <form action={createChild} onSubmit={() => setLoading(true)} className="space-y-8">
        <input type="hidden" name="parentsData" value={JSON.stringify(parents)} />
        <input type="hidden" name="contactsData" value={JSON.stringify(contacts)} />

        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Stammdaten</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">Vorname *</label>
              <input name="firstName" className="input" required />
            </div>
            <div className="form-control">
              <label className="label">Nachname *</label>
              <input name="lastName" className="input" required />
            </div>
            <div className="form-control">
              <label className="label">Geburtsdatum *</label>
              <input type="date" name="dateOfBirth" className="input" required />
            </div>
            <div className="form-control">
              <label className="label">Geschlecht</label>
              <select name="gender" className="select w-full">
                <option value="">Bitte wählen</option>
                <option value="MALE">Männlich</option>
                <option value="FEMALE">Weiblich</option>
                <option value="D">Divers</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label">Eintrittsdatum *</label>
              <input type="date" name="entryDate" className="input" required />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Eltern</h2>
            <button type="button" onClick={handleAddParent} className="btn btn-outline btn-sm flex items-center gap-2">
              <Plus className="w-4 h-4" /> Hinzufügen
            </button>
          </div>
          <div className="space-y-4">
            {parents.map((p, i) => (
              <div key={i} className={`border rounded-lg p-4 ${p.createPartner ? "bg-purple-50 border-purple-200" : "bg-gray-50 border-gray-200"}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">Elternteil {i + 1}</span>
                    {p.existingPartnerId ? (
                      <span className="badge badge-primary gap-1">
                        <LinkIcon className="w-3 h-3" />
                        Verknüpfung mit existierendem Partner
                      </span>
                    ) : (
                      <label className="badge ml-2 cursor-pointer gap-2 p-3 hover:bg-opacity-80 transition-all">
                        <input
                          type="checkbox"
                          checked={p.createPartner}
                          onChange={(e) => handleParentChange(i, "createPartner", e.target.checked)}
                          className="checkbox checkbox-xs"
                        />
                        <span className="text-xs">{p.createPartner ? "Wird als Partner angelegt" : "Nur Kontakt (kein Partner)"}</span>
                      </label>
                    )}
                  </div>
                  {parents.length > 1 && (
                    <button type="button" onClick={() => handleRemoveParent(i)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
                  <input
                    placeholder="Vorname"
                    value={p.firstName}
                    onChange={(e) => handleParentChange(i, "firstName", e.target.value)}
                    className="input input-sm"
                    required={i === 0}
                    disabled={!!p.existingPartnerId}
                  />
                  <input
                    placeholder="Nachname"
                    value={p.lastName}
                    onChange={(e) => handleParentChange(i, "lastName", e.target.value)}
                    className="input input-sm"
                    required={i === 0}
                    disabled={!!p.existingPartnerId}
                  />
                  <input
                    placeholder="Telefon"
                    value={p.phone}
                    onChange={(e) => handleParentChange(i, "phone", e.target.value)}
                    className="input input-sm"
                  />
                  <input
                    placeholder="E-Mail"
                    value={p.email}
                    onChange={(e) => handleParentChange(i, "email", e.target.value)}
                    className="input input-sm"
                  />
                  <label className={`flex items-center gap-2 ${parents.length === 1 ? "opacity-100 cursor-not-allowed" : "cursor-pointer"}`}>
                    <input
                      type="checkbox"
                      checked={p.isPrimary}
                      disabled={parents.length === 1}
                      onChange={(e) => handleParentChange(i, "isPrimary", e.target.checked)}
                      className="checkbox checkbox-sm checkbox-primary"
                    />
                    <span className="text-sm font-medium">Hauptkontakt</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Notfallkontakte</h2>
            <button
              type="button"
              onClick={() => setContacts([...contacts, { name: "", relationship: "", phone: "" }])}
              className="btn btn-outline btn-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Hinzufügen
            </button>
          </div>
          <div className="space-y-4">
            {contacts.map((c, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">Notfallkontakt {i + 1}</span>
                  {contacts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setContacts(contacts.filter((_, ci) => ci !== i))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input
                    placeholder="Name"
                    value={c.name}
                    onChange={(e) => {
                      const nc = [...contacts];
                      nc[i].name = e.target.value;
                      setContacts(nc);
                    }}
                    className="input input-sm"
                  />
                  <input
                    placeholder="Beziehung (z.B. Oma)"
                    value={c.relationship}
                    onChange={(e) => {
                      const nc = [...contacts];
                      nc[i].relationship = e.target.value;
                      setContacts(nc);
                    }}
                    className="input input-sm"
                  />
                  <input
                    placeholder="Telefon"
                    value={c.phone}
                    onChange={(e) => {
                      const nc = [...contacts];
                      nc[i].phone = e.target.value;
                      setContacts(nc);
                    }}
                    className="input input-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Gesundheit & Besonderes</h2>
          <div className="space-y-4">
            <div>
              <label className="label">Allergien</label>
              <textarea name="allergies" className="textarea w-full" rows={2} placeholder="z.B. Nüsse, Laktose..." />
            </div>
            <div>
              <label className="label">Besonderes / Notizen</label>
              <textarea name="specialNotes" className="textarea w-full" rows={3} placeholder="Wichtige Informationen..." />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/children" className="btn btn-ghost">
            Abbrechen
          </Link>
          <button type="submit" disabled={loading} className="btn btn-primary">
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Wird gespeichert..." : "Kind erstellen"}
          </button>
        </div>
      </form>
    </div>
  );
}
