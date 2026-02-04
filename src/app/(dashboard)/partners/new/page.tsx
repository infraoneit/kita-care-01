"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Building2, User } from "lucide-react";
import { createPartner } from "@/app/actions/partners";

export default function NewPartnerPage() {
  const [loading, setLoading] = useState(false);
  const [isCompany, setIsCompany] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/partners" className="btn btn-ghost btn-circle">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Neuer Partner</h1>
      </div>

      <form action={createPartner} onSubmit={() => setLoading(true)} className="space-y-8">
        <div className="card p-6">
          <div className="flex gap-4 mb-6">
            <button
              type="button"
              className={`flex-1 p-4 rounded-lg border-2 flex flex-col items-center gap-2 ${!isCompany ? "border-purple-600 bg-purple-50" : "border-gray-200 hover:border-gray-300"}`}
              onClick={() => setIsCompany(false)}
            >
              <User className={`w-8 h-8 ${!isCompany ? "text-purple-600" : "text-gray-400"}`} />
              <span className="font-semibold">Privatperson</span>
            </button>
            <button
              type="button"
              className={`flex-1 p-4 rounded-lg border-2 flex flex-col items-center gap-2 ${isCompany ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
              onClick={() => setIsCompany(true)}
            >
              <Building2 className={`w-8 h-8 ${isCompany ? "text-blue-600" : "text-gray-400"}`} />
              <span className="font-semibold">Firma / Institution</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isCompany && (
              <div className="md:col-span-2 form-control">
                <label className="label">Firmenname *</label>
                <input name="companyName" className="input" required />
              </div>
            )}

            <div className="form-control">
              <label className="label">Vorname {!isCompany && "*"}</label>
              <input name="firstName" className="input" required={!isCompany} />
            </div>

            <div className="form-control">
              <label className="label">Nachname {!isCompany && "*"}</label>
              <input name="lastName" className="input" required={!isCompany} />
            </div>

            <div className="form-control">
              <label className="label">E-Mail</label>
              <input type="email" name="email" className="input" />
            </div>

            <div className="form-control">
              <label className="label">Telefon</label>
              <input name="phone" className="input" />
            </div>

            {!isCompany && (
              <div className="form-control">
                <label className="label">Mobil</label>
                <input name="mobile" className="input" />
              </div>
            )}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Adresse</h2>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-12 form-control">
              <label className="label">Strasse / Nr.</label>
              <input name="address" className="input" />
            </div>
            <div className="md:col-span-4 form-control">
              <label className="label">PLZ</label>
              <input name="zip" className="input" />
            </div>
            <div className="md:col-span-8 form-control">
              <label className="label">Ort</label>
              <input name="city" className="input" />
            </div>
            <div className="md:col-span-12 form-control">
              <label className="label">Land</label>
              <select name="country" className="select" defaultValue="CH">
                <option value="CH">Schweiz</option>
                <option value="DE">Deutschland</option>
                <option value="AT">Österreich</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Finanzen & Diverses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label">IBAN</label>
              <input name="bankAccount" className="input" placeholder="CH..." />
            </div>
            {isCompany && (
              <div className="form-control">
                <label className="label">MwSt-Nr. / UID</label>
                <input name="taxId" className="input" />
              </div>
            )}
            <div className="md:col-span-2 form-control">
              <label className="label">Notizen</label>
              <textarea name="notes" className="textarea" rows={3} />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/partners" className="btn btn-ghost">
            Abbrechen
          </Link>
          <button type="submit" disabled={loading} className="btn btn-primary">
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Wird gespeichert..." : "Partner erstellen"}
          </button>
        </div>
      </form>
    </div>
  );
}
