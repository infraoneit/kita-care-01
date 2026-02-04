"use client";

import { useState } from "react";
import { createDailyLog } from "@/app/actions/children";
import { Smile, Frown, Meh, Moon, Utensils, Activity, X } from "lucide-react";

interface DailyLogModalProps {
  child: { id: string; firstName: string; lastName: string; photoUrl: string | null } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DailyLogModal({ child, isOpen, onClose }: DailyLogModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !child) return null;

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    await createDailyLog(formData);
    setLoading(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Tagesprotokoll für {child.firstName}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form action={handleSubmit} className="p-6 space-y-6">
          <input type="hidden" name="childId" value={child.id} />

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 block">Datum</label>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <DateSelector />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 block">Stimmung</label>
            <div className="flex gap-4">
              <label className="flex-1 cursor-pointer">
                <input type="radio" name="mood" value="HAPPY" className="peer sr-only" defaultChecked />
                <div className="p-4 rounded-lg border-2 border-gray-200 peer-checked:border-green-500 peer-checked:bg-green-50 hover:bg-gray-50 flex flex-col items-center gap-2 transition-all">
                  <Smile className="w-8 h-8 text-green-500" />
                  <span className="text-xs font-medium text-gray-600">Fröhlich</span>
                </div>
              </label>
              <label className="flex-1 cursor-pointer">
                <input type="radio" name="mood" value="NEUTRAL" className="peer sr-only" />
                <div className="p-4 rounded-lg border-2 border-gray-200 peer-checked:border-yellow-500 peer-checked:bg-yellow-50 hover:bg-gray-50 flex flex-col items-center gap-2 transition-all">
                  <Meh className="w-8 h-8 text-yellow-500" />
                  <span className="text-xs font-medium text-gray-600">Neutral</span>
                </div>
              </label>
              <label className="flex-1 cursor-pointer">
                <input type="radio" name="mood" value="SAD" className="peer sr-only" />
                <div className="p-4 rounded-lg border-2 border-gray-200 peer-checked:border-red-500 peer-checked:bg-red-50 hover:bg-gray-50 flex flex-col items-center gap-2 transition-all">
                  <Frown className="w-8 h-8 text-red-500" />
                  <span className="text-xs font-medium text-gray-600">Traurig</span>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Utensils className="w-4 h-4" /> Mahlzeiten
            </label>
            <select name="meals" className="select w-full">
              <option value="ALL">Alles aufgegessen</option>
              <option value="MOST">Meistes gegessen</option>
              <option value="SOME">Wenig gegessen</option>
              <option value="NONE">Nicht gegessen</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Moon className="w-4 h-4" /> Schlaf (Stunden)
            </label>
            <input type="number" name="sleep" step="0.5" placeholder="z.B. 1.5" className="input w-full" />
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Activity className="w-4 h-4" /> Aktivitäten / Notizen
            </label>
            <textarea name="activities" rows={3} className="textarea w-full" placeholder="Was wurde heute gemacht?" />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Abbrechen
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? "Speichere..." : "Speichern"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DateSelector() {
  const [selected, setSelected] = useState("today");
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const dayBefore = new Date(today);
  dayBefore.setDate(today.getDate() - 2);

  const getDateValue = (type: string) => {
    if (type === "today") return today.toISOString();
    if (type === "yesterday") return yesterday.toISOString();
    if (type === "dayBefore") return dayBefore.toISOString();
    return today.toISOString();
  };

  return (
    <>
      <input type="hidden" name="date" value={getDateValue(selected)} />
      <button
        type="button"
        onClick={() => setSelected("today")}
        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
          selected === "today" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
        }`}
      >
        Heute
      </button>
      <button
        type="button"
        onClick={() => setSelected("yesterday")}
        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
          selected === "yesterday" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
        }`}
      >
        Gestern
      </button>
      <button
        type="button"
        onClick={() => setSelected("dayBefore")}
        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
          selected === "dayBefore" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
        }`}
      >
        Vorgestern
      </button>
    </>
  );
}
