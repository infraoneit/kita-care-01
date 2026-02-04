import { requireSession } from "@/core/session";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, User, Mail, Phone, MapPin, CreditCard, FileText, Pencil } from "lucide-react";
import { AssignChildModal } from "./AssignChildModal";
import { DeletePartnerButton } from "./DeletePartnerButton";
import { getDemoAvailableChildren, getDemoPartnerById } from "@/mock/data";

export default async function PartnerDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { tab?: string };
}) {
  const session = await requireSession();
  const activeTab = searchParams.tab || "overview";

  const partner = getDemoPartnerById(params.id);

  if (!partner || partner.organisationId !== session.organisationId) notFound();

  const assignedChildIds = partner.children.map((cp) => cp.childId);

  const availableChildren = getDemoAvailableChildren(assignedChildIds);

  const isCompany = !!partner.companyName;

  const tabs = [
    { id: "overview", label: "Übersicht" },
    { id: "contacts", label: "Kontakte" },
    { id: "children", label: "Beziehungen" },
    { id: "finance", label: "Finanzen" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/partners" className="btn btn-ghost btn-circle">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isCompany ? "bg-blue-100" : "bg-purple-100"}`}>
              {isCompany ? <Building2 className="w-8 h-8 text-blue-600" /> : <User className="w-8 h-8 text-purple-600" />}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {partner.companyName || `${partner.firstName} ${partner.lastName}`}
              </h1>
              {isCompany && partner.firstName && <p className="text-gray-500">AP: {partner.firstName} {partner.lastName}</p>}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/partners/${partner.id}/edit`} className="btn btn-primary">
            <Pencil className="w-4 h-4 mr-2" />
            Bearbeiten
          </Link>
          <DeletePartnerButton partnerId={partner.id} partnerName={partner.companyName || `${partner.firstName} ${partner.lastName}`} />
        </div>
      </div>

      <div className="card p-2">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={`/partners/${partner.id}?tab=${tab.id}`}
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
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Kurzüberblick</h2>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p className="text-xs uppercase text-gray-400">Kinder</p>
                <p className="text-xl font-bold text-gray-900">{partner.children.length}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-400">Rechnungen</p>
                <p className="text-xl font-bold text-gray-900">{partner.invoices.length}</p>
              </div>
            </div>
          </div>
          {partner.notes && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold mb-2">Notizen</h2>
              <p className="text-gray-600 whitespace-pre-wrap">{partner.notes}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "contacts" && (
        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Kontaktdaten</h2>

          {partner.email && (
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <a href={`mailto:${partner.email}`} className="text-blue-600 hover:underline">{partner.email}</a>
            </div>
          )}
          {partner.phone && (
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <span>{partner.phone}</span>
            </div>
          )}
          {partner.mobile && (
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <span>{partner.mobile} (Mobil)</span>
            </div>
          )}
          {(partner.address || partner.city) && (
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p>{partner.address}</p>
                <p>{partner.zip} {partner.city}</p>
                <p>{partner.country}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "children" && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4 border-b pb-2">
            <h2 className="text-lg font-semibold">Verknüpfte Kinder</h2>
            <AssignChildModal partnerId={partner.id} partnerName={partner.companyName || `${partner.firstName} ${partner.lastName}`} availableChildren={availableChildren} />
          </div>

          {partner.children.length > 0 ? (
            <div className="space-y-4">
              {partner.children.map((cp) => (
                <Link key={cp.id} href={`/children/${cp.childId}`} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold">
                    {cp.child.firstName[0]}
                  </div>
                  <div>
                    <p className="font-medium">{cp.child.firstName} {cp.child.lastName}</p>
                    <p className="text-sm text-gray-500">{cp.relationship}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Keine Kinder verknüpft</p>
          )}
        </div>
      )}

      {activeTab === "finance" && (
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Letzte Rechnungen</h2>
            {partner.invoices.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Nr.</th>
                      <th>Datum</th>
                      <th>Betrag</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partner.invoices.map((inv) => (
                      <tr key={inv.id}>
                        <td>{inv.number}</td>
                        <td>{new Date(inv.date).toLocaleDateString("de-CH")}</td>
                        <td>CHF {inv.total.toFixed(2)}</td>
                        <td><span className="badge">{inv.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Keine Rechnungen vorhanden</p>
            )}
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Finanzen</h2>
            {partner.bankAccount && (
              <div className="flex items-center gap-3 mb-2">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <span>{partner.bankAccount}</span>
              </div>
            )}
            {partner.taxId && (
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <span>{partner.taxId}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
