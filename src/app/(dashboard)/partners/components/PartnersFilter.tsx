"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function PartnersFilter() {
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
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Partner suchen (Name, Firma, E-Mail)..."
          defaultValue={searchParams.get("search")?.toString()}
          className="input pl-10 w-full"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        <input
          type="text"
          className="input input-sm"
          placeholder="E-Mail"
          defaultValue={searchParams.get("email")?.toString() || ""}
          onChange={(e) => updateParam("email", e.target.value || null)}
        />
        <input
          type="text"
          className="input input-sm"
          placeholder="Telefon"
          defaultValue={searchParams.get("phone")?.toString() || ""}
          onChange={(e) => updateParam("phone", e.target.value || null)}
        />
        <input
          type="text"
          className="input input-sm"
          placeholder="Ort"
          defaultValue={searchParams.get("city")?.toString() || ""}
          onChange={(e) => updateParam("city", e.target.value || null)}
        />
        <input
          type="text"
          className="input input-sm"
          placeholder="PLZ"
          defaultValue={searchParams.get("zip")?.toString() || ""}
          onChange={(e) => updateParam("zip", e.target.value || null)}
        />
        <select
          className="select select-sm"
          defaultValue={searchParams.get("type")?.toString() || "all"}
          onChange={(e) => updateParam("type", e.target.value === "all" ? null : e.target.value)}
        >
          <option value="all">Alle Typen</option>
          <option value="company">Firma</option>
          <option value="private">Privatperson</option>
        </select>
      </div>
    </div>
  );
}
