"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { deleteChild } from "@/app/actions/children";

interface DeleteChildButtonProps {
  childId: string;
  childName: string;
}

export function DeleteChildButton({ childId, childName }: DeleteChildButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`${childName} wirklich löschen?`)) return;

    setIsDeleting(true);
    try {
      await deleteChild(childId);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Fehler beim Löschen");
      setIsDeleting(false);
    }
  };

  return (
    <button onClick={handleDelete} disabled={isDeleting} className="btn btn-outline btn-error gap-2 hover:text-white">
      <AlertTriangle className="w-4 h-4" />
      {isDeleting ? "Wird gelöscht..." : "Löschen"}
    </button>
  );
}
