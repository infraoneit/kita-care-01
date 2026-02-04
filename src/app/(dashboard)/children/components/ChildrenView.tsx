"use client";

import { LayoutGrid, List } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChildrenGrid } from "./ChildrenGrid";
import { ChildrenTable } from "./ChildrenTable";

interface ChildrenViewProps {
  childrenList: any[];
}

export function ChildrenView({ childrenList }: ChildrenViewProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const view = searchParams.get("view") || "grid";

  const toggleView = (newView: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("view", newView);
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <div className="join">
          <button className={`join-item btn btn-sm ${view === "grid" ? "btn-active" : ""}`} onClick={() => toggleView("grid")}>
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button className={`join-item btn btn-sm ${view === "list" ? "btn-active" : ""}`} onClick={() => toggleView("list")}>
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {view === "grid" ? <ChildrenGrid childrenList={childrenList} /> : <ChildrenTable childrenList={childrenList} />}
    </div>
  );
}
