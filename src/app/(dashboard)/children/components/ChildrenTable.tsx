"use client";

import Link from "next/link";
import { Eye, Activity } from "lucide-react";
import { DailyLogModal } from "./DailyLogModal";
import { useState } from "react";
import { calculateAge } from "@/lib/utils";

interface ChildrenTableProps {
  childrenList: any[];
}

export function ChildrenTable({ childrenList }: ChildrenTableProps) {
  const [selectedChild, setSelectedChild] = useState<any>(null);

  if (!childrenList.length) {
    return <div className="text-center py-4 text-gray-500">Keine Kinder gefunden</div>;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th className="text-left">Name</th>
              <th className="text-left">Alter</th>
              <th className="text-left">Eltern</th>
              <th className="text-left">Status</th>
              <th className="text-left">Eintritt / Austritt</th>
              <th className="text-left">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {childrenList.map((child) => {
              const ageYears = calculateAge(child.dateOfBirth);
              const parents = child.partners
                .map((p: any) => `${p.partner.firstName} ${p.partner.lastName}`)
                .join(", ");

              return (
                <tr key={child.id} className="hover:bg-gray-50">
                  <td className="text-left">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center">
                        <span className="text-xs">{child.firstName[0]}{child.lastName[0]}</span>
                      </div>
                      <div className="font-bold">{child.firstName} {child.lastName}</div>
                    </div>
                  </td>
                  <td className="text-left">{ageYears} Jahre</td>
                  <td className="text-left">
                    <div className="text-sm text-gray-500 max-w-xs truncate" title={parents}>
                      {parents || "-"}
                    </div>
                  </td>
                  <td className="text-left">
                    <div className="flex gap-1 flex-wrap">
                      {child.allergies && <span className="badge badge-warning badge-xs">Allergie</span>}
                      {child.doctorInfo && <span className="badge badge-ghost badge-xs">Arzt</span>}
                    </div>
                  </td>
                  <td className="text-left">
                    <div className="text-xs">
                      <div>{new Date(child.entryDate).toLocaleDateString("de-CH")}</div>
                      {child.exitDate && (
                        <div className="text-orange-600">
                          Bis: {new Date(child.exitDate).toLocaleDateString("de-CH")}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="text-left">
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedChild(child)} className="btn btn-ghost btn-xs">
                        <Activity className="w-4 h-4" />
                      </button>
                      <Link href={`/children/${child.id}`} className="btn btn-ghost btn-xs">
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <DailyLogModal child={selectedChild} isOpen={!!selectedChild} onClose={() => setSelectedChild(null)} />
    </>
  );
}
