"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Activity, AlertTriangle, User, Calendar, Clock } from "lucide-react";
import { DailyLogModal } from "./DailyLogModal";
import { calculateAge } from "@/lib/utils";

interface ChildrenGridProps {
  childrenList: any[];
}

export function ChildrenGrid({ childrenList }: ChildrenGridProps) {
  const [selectedChild, setSelectedChild] = useState<any>(null);

  if (!childrenList.length) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Keine Kinder gefunden</h3>
        <p className="text-gray-500">Versuche die Filter anzupassen oder erstelle ein neues Kind.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {childrenList.map((child) => {
          const parents = child.partners
            .map((p: any) => `${p.partner.firstName} ${p.partner.lastName} (${p.relationship})`)
            .join(", ");

          const hasAllergy = !!child.allergies;
          const isLeavingSoon =
            child.exitDate && new Date(child.exitDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

          return (
            <div key={child.id} className="card hover:shadow-lg transition-all group relative">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-lg">
                      {child.firstName[0]}
                      {child.lastName[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        <Link href={`/children/${child.id}`} className="hover:text-pink-600 hover:underline">
                          {child.firstName} {child.lastName}
                        </Link>
                      </h3>
                      <p className="text-xs text-gray-500">{calculateAge(child.dateOfBirth)} Jahre</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {hasAllergy && (
                    <span className="badge badge-warning flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Allergie
                    </span>
                  )}
                  {isLeavingSoon && (
                    <span className="badge bg-orange-100 text-orange-700 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Austritt bald
                    </span>
                  )}
                  {child.doctorInfo && <span className="badge badge-ghost text-xs">Arzt hinterlegt</span>}
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 mt-0.5 text-gray-400" />
                    <span className="text-xs line-clamp-2" title={parents || "Keine Eltern zugewiesen"}>
                      {parents || "Keine Eltern zugewiesen"}
                    </span>
                  </div>
                  {child.exitDate && (
                    <div className="flex items-center gap-2 text-orange-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs">
                        Austritt: {new Date(child.exitDate).toLocaleDateString("de-CH")}
                      </span>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-4 flex gap-2">
                  <button onClick={() => setSelectedChild(child)} className="btn btn-sm btn-outline flex-1 gap-2">
                    <Activity className="w-4 h-4" />
                    Protokoll
                  </button>
                  <Link href={`/children/${child.id}`} className="btn btn-sm btn-ghost flex-1 gap-2">
                    <FileText className="w-4 h-4" />
                    Details
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <DailyLogModal child={selectedChild} isOpen={!!selectedChild} onClose={() => setSelectedChild(null)} />
    </>
  );
}
