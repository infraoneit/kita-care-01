import { requireSession } from "@/core/session";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Calendar, Printer, Mail, Phone, User, FileText, Activity } from "lucide-react";
import { calculateAge, formatDate } from "@/lib/utils";
import { RecentActivity } from "./RecentActivity";
import { DeleteChildButton } from "./DeleteChildButton";
import { ContractInfo } from "./ContractInfo";
import { DailyStats } from "./DailyStats";
import { getDemoChildById } from "@/mock/data";

export default async function ChildDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await requireSession();
  const { id } = await params;
  const { tab } = await searchParams;
  const activeTab = tab || "overview";

  const child = getDemoChildById(id);
  if (!child || child.organisationId !== session.organisationId) notFound();

  const age = calculateAge(child.dateOfBirth);
  const getGenderLabel = (g: string | null) => {
    if (g === "MALE" || g === "M") return "Männlich";
    if (g === "FEMALE" || g === "F") return "Weiblich";
    if (g === "D") return "Divers";
    return "-";
  };

  const tabs = [
    { id: "overview", label: "Übersicht" },
    { id: "contacts", label: "Kontakte" },
    { id: "contract", label: "Vertrag/Belegung" },
    { id: "activity", label: "Protokoll" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/children" className="btn btn-ghost btn-circle">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-4">
            {child.photoUrl ? (
              <img src={child.photoUrl} alt={child.firstName} className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold ${
                  child.gender === "M" ? "bg-blue-100 text-blue-600" : child.gender === "F" ? "bg-pink-100 text-pink-600" : "bg-gray-100 text-gray-600"
                }`}
              >
                {child.firstName[0]}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {child.firstName} {child.lastName}
              </h1>
              <p className="text-gray-500">
                {getGenderLabel(child.gender)} • {age} Jahre ({formatDate(child.dateOfBirth)})
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/children/${child.id}/print`} target="_blank" className="btn btn-outline gap-2">
            <Printer className="w-4 h-4" />
            PDF Export
          </Link>
          <DeleteChildButton childId={child.id} childName={`${child.firstName} ${child.lastName}`} />
          <Link href={`/children/${child.id}/edit`} className="btn btn-primary">
            <Edit className="w-4 h-4 mr-2" />
            Bearbeiten
          </Link>
        </div>
      </div>

      <div className="card p-2">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={`/children/${child.id}?tab=${tab.id}`}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === tab.id ? "bg-pink-50 text-pink-600" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card bg-white border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" />
                Stammdaten & Vertrag
              </h2>
            </div>
            <div className="p-4 grid grid-cols-2 gap-y-4 gap-x-8">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Vorname</span>
                <span className="text-sm font-medium">{child.firstName}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Nachname</span>
                <span className="text-sm font-medium">{child.lastName}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Geburtsdatum</span>
                <span className="text-sm font-medium">{formatDate(child.dateOfBirth)}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Geschlecht</span>
                <span className="text-sm font-medium">{getGenderLabel(child.gender)}</span>
              </div>
              <div className="col-span-2 divider my-0" />
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Eintrittsdatum</span>
                <span className="text-sm font-medium">{formatDate(child.entryDate)}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Austrittsdatum</span>
                <span className="text-sm font-medium">{child.exitDate ? formatDate(child.exitDate) : "-"}</span>
              </div>
              <div className="col-span-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Gruppen</span>
                <div className="flex flex-wrap gap-2">
                  {child.enrollments.length > 0 ? (
                    child.enrollments.map((b) => (
                      <span key={b.id} className="badge badge-primary badge-outline text-xs">
                        {b.group.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-white border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-100 bg-amber-50/50">
              <h2 className="text-base flex items-center gap-2 text-amber-900">
                <Activity className="w-4 h-4" />
                Medizinische Informationen
              </h2>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <span className="text-xs font-semibold text-amber-800/60 uppercase tracking-wider block mb-1">Allergien / Unverträglichkeiten</span>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{child.allergies || "-"}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-amber-800/60 uppercase tracking-wider block mb-1">Hausarzt / Medizinische Kontakte</span>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{child.doctorInfo || "-"}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-amber-800/60 uppercase tracking-wider block mb-1">Besondere Hinweise</span>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{child.specialNotes || "-"}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "contacts" && (
        <div className="card bg-white border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-base flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              Eltern & Kontaktpersonen
            </h2>
          </div>
          <div className="p-4 space-y-4">
            {child.partners.length > 0 ? (
              <div className="space-y-3">
                {child.partners.map((p) => (
                  <Link
                    key={p.id}
                    href={`/partners/${p.partnerId}`}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-200 text-gray-500 font-bold text-xs group-hover:border-pink-600 group-hover:text-pink-600">
                      {p.partner.firstName?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="font-medium text-sm text-gray-900">
                          {p.partner.firstName} {p.partner.lastName}
                        </p>
                        <span className="text-[10px] px-1.5 py-0.5 bg-white border rounded text-gray-500 uppercase tracking-wide">
                          {p.relationship}
                        </span>
                      </div>
                      {(p.partner.email || p.partner.phone) && (
                        <div className="mt-1 space-y-0.5">
                          {p.partner.phone && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <Phone className="w-3 h-3" /> {p.partner.phone}
                            </div>
                          )}
                          {p.partner.email && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 truncate">
                              <Mail className="w-3 h-3" /> {p.partner.email}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">Keine Eltern verknüpft.</p>
            )}

            {child.emergencyContacts.length > 0 && (
              <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                <span className="text-xs font-semibold text-red-800 uppercase tracking-wider block mb-3">Notfallkontakte</span>
                <div className="space-y-2">
                  {child.emergencyContacts.map((c) => (
                    <div key={c.id} className="flex justify-between items-center p-2 bg-red-50 rounded border border-red-100">
                      <div>
                        <p className="text-sm font-medium text-red-900">{c.name}</p>
                        <p className="text-xs text-red-700">{c.phone}</p>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 bg-white rounded border border-red-200 text-red-600 uppercase">
                        {c.relationship}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "contract" && (
        <div className="space-y-6">
          <ContractInfo child={child} />
          <div className="card bg-white border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                Belegung / Wochenplan (Platzhalter)
              </h2>
            </div>
            <div className="p-4">
              <div className="w-full h-32 bg-gray-50 rounded border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 text-sm">
                Hier wird der Belegungsplan (Mo-Fr) visualisiert
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "activity" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DailyStats childId={child.id} />
          <RecentActivity childId={child.id} />
        </div>
      )}
    </div>
  );
}
