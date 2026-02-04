"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function VerwaltungFilter() {
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
    updateParam("q", term || null);
  }, 300);

  return (
    <div className="card p-6 space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-[240px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Volltextsuche (Name, Telefon, E‑Mail, Gruppe)..."
              defaultValue={searchParams.get("q")?.toString()}
              className="input pl-10 w-full"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        <select
          className="select select-sm"
          defaultValue={searchParams.get("birthYear")?.toString() || ""}
          onChange={(e) => updateParam("birthYear", e.target.value || null)}
        >
          <option value="">Jahrgang</option>
          {Array.from({ length: 8 }, (_, i) => {
            const year = new Date().getFullYear() - i;
            return (
              <option key={year} value={`${year}`}>
                {year}
              </option>
            );
          })}
        </select>

        <select
          className="select select-sm"
          defaultValue={searchParams.get("sort")?.toString() || "alpha-asc"}
          onChange={(e) => updateParam("sort", e.target.value || null)}
        >
          <option value="alpha-asc">Alphabetisch A-Z</option>
          <option value="alpha-desc">Alphabetisch Z-A</option>
          <option value="year-asc">Jahrgang aufsteigend</option>
          <option value="year-desc">Jahrgang absteigend</option>
        </select>
      </div>
    </div>
  );
}
