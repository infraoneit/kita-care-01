import { Calendar, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

export function ContractInfo({ child }: { child: any }) {
  return (
    <div className="card p-6 bg-white border border-gray-100 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Vertragsdaten</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-gray-600">
            <Calendar className="w-5 h-5" />
            <span>Eintritt</span>
          </div>
          <span className="font-medium">{formatDate(child.entryDate)}</span>
        </div>
        {child.exitDate && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-gray-600">
              <Clock className="w-5 h-5" />
              <span>Austritt</span>
            </div>
            <span className="font-medium">{formatDate(child.exitDate)}</span>
          </div>
        )}

        {child.enrollments && child.enrollments.length > 0 && (
          <div className="pt-2 border-t mt-2">
            <span className="text-sm text-gray-500 block mb-2">Gruppen</span>
            <div className="flex flex-wrap gap-2">
              {child.enrollments.map((b: any) => (
                <span key={b.id} className="badge badge-primary badge-outline">
                  {b.group ? b.group.name : "Unbekannte Gruppe"}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
