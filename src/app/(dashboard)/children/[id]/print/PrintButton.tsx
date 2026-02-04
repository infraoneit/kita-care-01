"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button className="btn btn-outline gap-2" onClick={() => window.print()}>
      <Printer className="w-4 h-4" />
      Drucken
    </button>
  );
}
