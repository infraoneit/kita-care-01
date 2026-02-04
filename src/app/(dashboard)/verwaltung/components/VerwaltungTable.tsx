"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, ChevronUp, ChevronDown } from "lucide-react";

type SortDir = "asc" | "desc";

export type VerwaltungRow = {
  id: string;
  childName: string;
  fatherFirst: string;
  motherFirst: string;
  birthDateIso: string;
  birthDateDisplay: string;
  entryDateIso: string;
  entryDateDisplay: string;
  exitDateIso: string | null;
  exitDateDisplay: string;
  primaryEmail: string;
  primaryPhone: string;
  groupNames: string;
  searchIndex: string;
};

type ColumnKey =
  | "childName"
  | "fatherFirst"
  | "motherFirst"
  | "birthDateDisplay"
  | "entryDateDisplay"
  | "exitDateDisplay"
  | "primaryEmail"
  | "primaryPhone"
  | "groupNames";

const columns: { key: ColumnKey; label: string; isDate?: boolean }[] = [
  { key: "childName", label: "Kind" },
  { key: "fatherFirst", label: "Vater" },
  { key: "motherFirst", label: "Mutter" },
  { key: "birthDateDisplay", label: "Geburt", isDate: true },
  { key: "entryDateDisplay", label: "Eintritt", isDate: true },
  { key: "exitDateDisplay", label: "Austritt", isDate: true },
  { key: "primaryEmail", label: "E-Mail" },
  { key: "primaryPhone", label: "Telefon" },
  { key: "groupNames", label: "Gruppe" },
];

export function VerwaltungTable({ rows }: { rows: VerwaltungRow[] }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<ColumnKey>("childName");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const toggleSort = (key: ColumnKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filteredRows = useMemo(() => {
    const searchLower = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (searchLower) {
        const haystack = row.searchIndex.toLowerCase();
        if (!haystack.includes(searchLower)) return false;
      }
      return true;
    });
  }, [rows, search]);

  const sortedRows = useMemo(() => {
    const col = columns.find((c) => c.key === sortKey);
    const sorted = [...filteredRows].sort((a, b) => {
      if (col?.isDate) {
        const aVal =
          sortKey === "birthDateDisplay"
            ? a.birthDateIso
            : sortKey === "entryDateDisplay"
            ? a.entryDateIso
            : a.exitDateIso || "";
        const bVal =
          sortKey === "birthDateDisplay"
            ? b.birthDateIso
            : sortKey === "entryDateDisplay"
            ? b.entryDateIso
            : b.exitDateIso || "";
        return aVal.localeCompare(bVal);
      }
      return String(a[sortKey] || "").localeCompare(String(b[sortKey] || ""));
    });
    return sortDir === "asc" ? sorted : sorted.reverse();
  }, [filteredRows, sortKey, sortDir]);

  const SortIcon = ({ active }: { active: boolean }) =>
    active ? (
      sortDir === "asc" ? (
        <ChevronUp className="w-3 h-3" />
      ) : (
        <ChevronDown className="w-3 h-3" />
      )
    ) : null;

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            className="input pl-10 w-full"
            placeholder="Volltextsuche (Name, Telefon, E‑Mail, Gruppe)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer select-none"
                  onClick={() => toggleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    <SortIcon active={sortKey === col.key} />
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aktion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedRows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.childName}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{row.fatherFirst || "-"}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{row.motherFirst || "-"}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{row.birthDateDisplay}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{row.entryDateDisplay}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{row.exitDateDisplay}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{row.primaryEmail || "-"}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{row.primaryPhone || "-"}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{row.groupNames || "-"}</td>
                <td className="px-4 py-3 text-sm">
                  <Link
                    href={`/verwaltung/${row.id}`}
                    prefetch={false}
                    className="text-pink-600 hover:underline"
                    onClick={() => {
                      // #region agent log
                      fetch('http://127.0.0.1:7244/ingest/f6bdf313-ecb7-43ca-a07e-715146912be3', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'VerwaltungTable.tsx:186', message: 'Verwaltung row click', data: { rowId: row.id, childName: row.childName, href: `/verwaltung/${row.id}` }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'pre-fix', hypothesisId: 'H4' }) }).catch(() => { });
                      // #endregion agent log
                    }}
                  >
                    Details/Bearbeiten
                  </Link>
                </td>
              </tr>
            ))}
            {sortedRows.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-sm text-gray-500 text-center" colSpan={10}>
                  Keine Einträge gefunden
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
