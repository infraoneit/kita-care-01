"use client";

import { useEffect, useState } from "react";
import { createDailyLog } from "@/app/actions/children";
import { Smile, Moon, Utensils, Activity } from "lucide-react";

export function DailyStats({
  childId,
  selectedDate,
  logDateKey,
}: {
  childId: string;
  selectedDate?: string;
  logDateKey?: string;
}) {
  const [loading, setLoading] = useState(false);
  const dateValue = selectedDate || "";

  useEffect(() => {}, [selectedDate, dateValue]);

  const handleSubmit = () => {
    setLoading(true);
  };

  return (
    <form action={createDailyLog} onSubmit={handleSubmit} className="card p-6 bg-white border border-gray-100 shadow-sm">
      <input type="hidden" name="childId" value={childId} />
      {logDateKey && <input type="hidden" name="logDateKey" value={logDateKey} />}
      {dateValue && <input type="hidden" name="date" value={dateValue} />}
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-blue-600" />
        Tagesprotokoll
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="form-control">
          <label className="label py-1">
            <span className="label-text flex items-center gap-2">
              <Smile className="w-4 h-4" /> Stimmung
            </span>
          </label>
          <select name="mood" className="select select-sm w-full">
            <option value="HAPPY">Fröhlich</option>
            <option value="NEUTRAL">Neutral</option>
            <option value="SAD">Traurig/Weinerlich</option>
            <option value="TIRED">Müde</option>
          </select>
        </div>
        <div className="form-control">
          <label className="label py-1">
            <span className="label-text flex items-center gap-2">
              <Moon className="w-4 h-4" /> Schlaf
            </span>
          </label>
          <select name="sleep" className="select select-sm w-full">
            <option value="GOOD">Gut geschlafen</option>
            <option value="OK">Okay</option>
            <option value="BAD">Schlecht/Wenig</option>
            <option value="NONE">Kein Schlaf</option>
          </select>
        </div>
        <div className="form-control">
          <label className="label py-1">
            <span className="label-text flex items-center gap-2">
              <Utensils className="w-4 h-4" /> Essen
            </span>
          </label>
          <select name="meals" className="select select-sm w-full">
            <option value="ALL">Alles gegessen</option>
            <option value="MOST">Meisten gegessen</option>
            <option value="LITTLE">Wenig gegessen</option>
            <option value="NOTHING">Nichts gegessen</option>
          </select>
        </div>
      </div>

      <div className="form-control mb-4">
        <label className="label py-1">
          <span className="label-text">Aktivitäten & Bemerkungen</span>
        </label>
        <textarea name="activities" className="textarea h-20" placeholder="Was wurde heute gemacht?" />
      </div>

      <button type="submit" disabled={loading} className="btn btn-primary btn-sm w-full">
        {loading ? "Speichert..." : "Protokoll speichern"}
      </button>
    </form>
  );
}
