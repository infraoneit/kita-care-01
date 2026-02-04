import { requireSession } from "@/core/session";
import Link from "next/link";
import { Plus, Download, Building2, User } from "lucide-react";
import { PartnersFilter } from "./components/PartnersFilter";
import { getDemoPartners } from "@/mock/data";

export default async function PartnersListPage({
  searchParams,
}: {
  searchParams: {
    search?: string;
    email?: string;
    phone?: string;
    city?: string;
    zip?: string;
    type?: string;
  };
}) {
  const session = await requireSession();
  const search = searchParams.search || "";
  const email = searchParams.email || "";
  const phone = searchParams.phone || "";
  const city = searchParams.city || "";
  const zip = searchParams.zip || "";
  const type = searchParams.type || "all";

  const partners = getDemoPartners()
    .filter((partner) => partner.organisationId === session.organisationId && partner.isActive)
    .filter((partner) => {
      if (search) {
        const searchLower = search.toLowerCase();
        const haystack = [
          partner.firstName,
          partner.lastName,
          partner.companyName,
          partner.email,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(searchLower)) return false;
      }
      if (email && !(partner.email || "").toLowerCase().includes(email.toLowerCase())) return false;
      if (
        phone &&
        !(partner.phone || "").toLowerCase().includes(phone.toLowerCase()) &&
        !(partner.mobile || "").toLowerCase().includes(phone.toLowerCase())
      ) {
        return false;
      }
      if (city && !(partner.city || "").toLowerCase().includes(city.toLowerCase())) return false;
      if (zip && !(partner.zip || "").toLowerCase().includes(zip.toLowerCase())) return false;
      if (type === "company" && !partner.companyName) return false;
      if (type === "private" && partner.companyName) return false;
      return true;
    })
    .sort((a, b) => (a.companyName || a.lastName || "").localeCompare(b.companyName || b.lastName || ""));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vertragspartner</h1>
          <p className="text-gray-600">{partners.length} aktive Partner</p>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-outline flex items-center gap-2">
            <Download className="w-4 h-4" />
            Excel Export
          </button>
          <Link href="/partners/new" className="btn btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Neuer Partner
          </Link>
        </div>
      </div>

      <PartnersFilter />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((partner) => {
          const outstandingInvoices = partner.invoices.filter((inv) => inv.outstandingAmount > 0);
          const totalOutstanding = outstandingInvoices.reduce((sum, inv) => sum + inv.outstandingAmount, 0);
          const isCompany = !!partner.companyName;

          return (
            <Link key={partner.id} href={`/partners/${partner.id}`} className="card hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isCompany ? "bg-blue-100" : "bg-purple-100"}`}>
                    {isCompany ? (
                      <Building2 className="w-6 h-6 text-blue-600" />
                    ) : (
                      <User className="w-6 h-6 text-purple-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {partner.companyName || `${partner.firstName} ${partner.lastName}`}
                    </h3>
                    {partner.companyName && partner.firstName && (
                      <p className="text-sm text-gray-600">{partner.firstName} {partner.lastName}</p>
                    )}
                    {partner.email && <p className="text-sm text-gray-500 truncate">{partner.email}</p>}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Kinder:</span>
                    <span className="font-medium">{partner.children.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Rechnungen:</span>
                    <span className="font-medium">{partner._count.invoices}</span>
                  </div>
                  {totalOutstanding > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Ausstehend:</span>
                      <span className="font-semibold text-red-600">CHF {totalOutstanding.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {partner.children.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-2">Verknüpfte Kinder:</p>
                    <div className="flex flex-wrap gap-2">
                      {partner.children.map((cp) => (
                        <span key={cp.id} className="badge text-xs">{cp.child.firstName}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {partners.length === 0 && (
        <div className="card">
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Keine Partner gefunden</p>
          </div>
        </div>
      )}
    </div>
  );
}
