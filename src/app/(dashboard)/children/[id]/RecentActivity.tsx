import { deleteDailyLog } from "@/app/actions/children";
import { Calendar } from "lucide-react";
import { getDemoDailyReportsByChildId } from "@/mock/data";

const moodLabels: Record<string, string> = {
  HAPPY: "Fröhlich",
  NEUTRAL: "Neutral",
  SAD: "Traurig/Weinerlich",
  TIRED: "Müde",
};

const sleepLabels: Record<string, string> = {
  GOOD: "Gut geschlafen",
  OK: "Okay",
  BAD: "Schlecht/Wenig",
  NONE: "Kein Schlaf",
};

const mealsLabels: Record<string, string> = {
  ALL: "Alles gegessen",
  MOST: "Meistens gegessen",
  LITTLE: "Wenig gegessen",
  NOTHING: "Nichts gegessen",
};

export async function RecentActivity({ childId }: { childId: string }) {
  const deleteCutoff = new Date();
  deleteCutoff.setDate(deleteCutoff.getDate() - 2);
  deleteCutoff.setHours(0, 0, 0, 0);

  // #region agent log
  fetch('http://127.0.0.1:7244/ingest/f6bdf313-ecb7-43ca-a07e-715146912be3', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'RecentActivity.tsx:34', message: 'RecentActivity filter', data: { selectedDate: null, dateFilter: null }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'pre-fix', hypothesisId: 'H3' }) }).catch(() => { });
  // #endregion agent log

  const logs = getDemoDailyReportsByChildId(childId)
    .slice()
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 10);

  // #region agent log
  fetch('http://127.0.0.1:7244/ingest/f6bdf313-ecb7-43ca-a07e-715146912be3', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'RecentActivity.tsx:45', message: 'RecentActivity results', data: { count: logs.length, dates: logs.map((l) => new Date(l.date).toISOString()) }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'pre-fix', hypothesisId: 'H3' }) }).catch(() => { });
  // #endregion agent log

  if (logs.length === 0) {
    return <div className="card p-6 bg-gray-50 text-center text-gray-500">Keine Aktivitäten in letzter Zeit.</div>;
  }

  return (
    <div className="card p-6 bg-white border border-gray-100 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Letzte Aktivitäten</h3>
      <div className="space-y-4">
        {logs.map((log) => {
          const logDay = new Date(log.date);
          logDay.setHours(0, 0, 0, 0);
          const canDelete = logDay >= deleteCutoff;
          return (
          <div key={log.id} className="relative pl-6 border-l-2 border-gray-200 pb-4 last:pb-0">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-500" />
            <div className="text-sm text-gray-500 mb-1 flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                {new Date(log.date).toLocaleDateString("de-CH")}
              </span>
              {canDelete && (
                <form action={deleteDailyLog}>
                  <input type="hidden" name="reportId" value={log.id} />
                  <button type="submit" className="text-xs text-red-600 hover:text-red-700">
                    Löschen
                  </button>
                </form>
              )}
            </div>
            <div className="font-medium text-gray-800">{log.content}</div>
            {log.activities && (
              <div className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
                <span className="font-medium">Aktivitäten:</span> {log.activities}
              </div>
            )}
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              {log.mood && <span className="badge badge-ghost badge-sm">{moodLabels[log.mood] || log.mood}</span>}
              {log.sleep && <span className="badge badge-ghost badge-sm">Schlaf: {sleepLabels[log.sleep] || log.sleep}</span>}
              {log.meals && <span className="badge badge-ghost badge-sm">Essen: {mealsLabels[log.meals] || log.meals}</span>}
            </div>
          </div>
        );
        })}
      </div>
    </div>
  );
}
