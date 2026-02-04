"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function ChildrenFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = (key: string, value?: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`?${params.toString()}`);
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    updateParam("search", term || null);
  }, 300);

  return (
    <div className="card p-6 space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Kind suchen..."
              defaultValue={searchParams.get("search")?.toString()}
              className="input pl-10 w-full"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
        <select
          className="select"
          defaultValue={searchParams.get("filter")?.toString() || "all"}
          onChange={(e) => updateParam("filter", e.target.value === "all" ? null : e.target.value)}
        >
          <option value="all">Alle Kinder</option>
          <option value="allergies">Mit Allergien</option>
          <option value="doctor">Mit Hausarzt</option>
          <option value="leaving">Austritt bald</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        <select
          className="select select-sm"
          defaultValue={searchParams.get("birthMonth")?.toString() || ""}
          onChange={(e) => updateParam("birthMonth", e.target.value || null)}
        >
          <option value="">Geburtsmonat</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={`${i + 1}`}>
              {i + 1}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="input input-sm"
          defaultValue={searchParams.get("entryFrom")?.toString() || ""}
          onChange={(e) => updateParam("entryFrom", e.target.value || null)}
          placeholder="Eintritt ab"
        />
        <input
          type="date"
          className="input input-sm"
          defaultValue={searchParams.get("entryTo")?.toString() || ""}
          onChange={(e) => updateParam("entryTo", e.target.value || null)}
          placeholder="Eintritt bis"
        />
        <input
          type="date"
          className="input input-sm"
          defaultValue={searchParams.get("exitFrom")?.toString() || ""}
          onChange={(e) => updateParam("exitFrom", e.target.value || null)}
          placeholder="Austritt ab"
        />
        <input
          type="date"
          className="input input-sm"
          defaultValue={searchParams.get("exitTo")?.toString() || ""}
          onChange={(e) => updateParam("exitTo", e.target.value || null)}
          placeholder="Austritt bis"
        />
      </div>
    </div>
  );
}
