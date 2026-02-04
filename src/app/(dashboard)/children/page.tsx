import { requireSession } from "@/core/session";
import Link from "next/link";
import { Plus, Download } from "lucide-react";
import { ChildrenFilter } from "./components/ChildrenFilter";
import { ChildrenView } from "./components/ChildrenView";
import { getDemoChildren } from "@/mock/data";

export default async function ChildrenListPage({
  searchParams,
}: {
  searchParams: {
    search?: string;
    filter?: string;
    view?: string;
    birthMonth?: string;
    entryFrom?: string;
    entryTo?: string;
    exitFrom?: string;
    exitTo?: string;
  };
}) {
  const session = await requireSession();
  const search = searchParams.search || "";
  const filter = searchParams.filter || "all";
  const birthMonth = searchParams.birthMonth ? Number(searchParams.birthMonth) : null;
  const entryFrom = searchParams.entryFrom ? new Date(searchParams.entryFrom) : null;
  const entryTo = searchParams.entryTo ? new Date(searchParams.entryTo) : null;
  const exitFrom = searchParams.exitFrom ? new Date(searchParams.exitFrom) : null;
  const exitTo = searchParams.exitTo ? new Date(searchParams.exitTo) : null;

  const children = getDemoChildren().filter((child) => {
    if (child.organisationId !== session.organisationId || !child.isActive) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      if (
        !child.firstName.toLowerCase().includes(searchLower) &&
        !child.lastName.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }
    if (filter === "allergies" && !child.allergies) return false;
    if (filter === "doctor" && !child.doctorInfo) return false;
    if (filter === "leaving") {
      if (!child.exitDate) return false;
      const cutoff = new Date(new Date().setDate(new Date().getDate() + 60));
      if (child.exitDate > cutoff) return false;
    }
    if (entryFrom && child.entryDate < entryFrom) return false;
    if (entryTo && child.entryDate > entryTo) return false;
    if (exitFrom && (!child.exitDate || child.exitDate < exitFrom)) return false;
    if (exitTo && (!child.exitDate || child.exitDate > exitTo)) return false;
    return true;
  });

  const filteredChildren = birthMonth
    ? children.filter((child) => new Date(child.dateOfBirth).getMonth() + 1 === birthMonth)
    : children;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kinder</h1>
          <p className="text-gray-600">{filteredChildren.length} aktive Kinder</p>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-outline flex items-center gap-2">
            <Download className="w-4 h-4" />
            Excel Export
          </button>
          <Link href="/children/new" className="btn btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Neues Kind
          </Link>
        </div>
      </div>

      <ChildrenFilter />
      <ChildrenView childrenList={filteredChildren} />
    </div>
  );
}
