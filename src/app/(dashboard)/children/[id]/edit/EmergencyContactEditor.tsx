"use client";

import { useState } from "react";
import { Trash2, Plus, UserPlus } from "lucide-react";

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

interface EmergencyContactEditorProps {
  initialContacts: EmergencyContact[];
}

export function EmergencyContactEditor({ initialContacts }: EmergencyContactEditorProps) {
  const [contacts, setContacts] = useState<EmergencyContact[]>(initialContacts);

  const addContact = () => {
    setContacts([...contacts, { name: "", relationship: "", phone: "" }]);
  };

  const removeContact = (index: number) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const updateContact = (index: number, field: keyof EmergencyContact, value: string) => {
    const newContacts = [...contacts];
    newContacts[index][field] = value;
    setContacts(newContacts);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="label text-sm font-medium">Notfallkontakte</label>
        <button type="button" onClick={addContact} className="btn btn-sm btn-outline gap-2">
          <Plus className="w-4 h-4" />
          Hinzufügen
        </button>
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <UserPlus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Keine Notfallkontakte definiert</p>
          <p className="text-xs text-gray-400 mt-1">Klicke auf "Hinzufügen" um einen Kontakt anzulegen</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map((contact, index) => (
            <div key={index} className="flex gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={contact.name}
                  onChange={(e) => updateContact(index, "name", e.target.value)}
                  placeholder="Name"
                  className="input input-sm"
                />
                <input
                  type="text"
                  value={contact.relationship}
                  onChange={(e) => updateContact(index, "relationship", e.target.value)}
                  placeholder="Beziehung (z.B. Oma)"
                  className="input input-sm"
                />
                <input
                  type="tel"
                  value={contact.phone}
                  onChange={(e) => updateContact(index, "phone", e.target.value)}
                  placeholder="Telefon"
                  className="input input-sm"
                />
              </div>
              <button
                type="button"
                onClick={() => removeContact(index)}
                className="btn btn-sm btn-ghost btn-circle text-red-500 hover:bg-red-50"
                title="Entfernen"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <input type="hidden" name="emergencyContacts" value={JSON.stringify(contacts)} />
    </div>
  );
}
