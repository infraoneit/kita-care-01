"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { assignChildToPartner } from "@/app/actions/partners";

export function AssignChildModal({
  partnerId,
  partnerName,
  availableChildren,
}: {
  partnerId: string;
  partnerName: string;
  availableChildren: { id: string; firstName: string; lastName: string }[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button type="button" className="btn btn-sm btn-outline gap-2" onClick={() => setIsOpen(true)}>
        <Plus className="w-4 h-4" /> Kind zuweisen
      </button>

      {isOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <button type="button" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => setIsOpen(false)}>
              ✕
            </button>

            <h3 className="font-bold text-lg mb-4">Kind zuweisen</h3>

            <form action={assignChildToPartner} className="space-y-4">
              <input type="hidden" name="partnerId" value={partnerId} />
              <input type="hidden" name="isPrimary" value="true" />

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Kind auswählen (nur Kinder ohne Hauptkontakt)</span>
                </label>
                <select name="childId" className="select w-full" required defaultValue="">
                  <option value="" disabled>
                    Bitte wählen...
                  </option>
                  {availableChildren.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.firstName} {child.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-action flex justify-between items-center">
                <Link href={`/children/new?partnerId=${partnerId}`} className="text-sm text-pink-600 hover:underline">
                  Neues Kind erstellen
                </Link>
                <button type="submit" className="btn btn-primary">
                  Als Hauptkontakt zuweisen
                </button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop" onClick={() => setIsOpen(false)} />
        </dialog>
      )}
    </>
  );
}
