"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { deletePartner } from "@/app/actions/partners";

interface DeletePartnerButtonProps {
  partnerId: string;
  partnerName: string;
}

export function DeletePartnerButton({ partnerId, partnerName }: DeletePartnerButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`${partnerName} wirklich löschen?`)) return;

    setIsDeleting(true);
    try {
      await deletePartner(partnerId);
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
