"use client";

import { useEffect, useState } from "react";
import { useChildren, useGroups, useCreateChildBooking } from "@/hooks/useAdminData";

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate?: Date;
}

export function BookingDialog({ open, onOpenChange, selectedDate }: BookingDialogProps) {
  const [childId, setChildId] = useState("");
  const [groupId, setGroupId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("16:00");
  const [isExtra, setIsExtra] = useState(false);
  const [notes, setNotes] = useState("");

  const { data: children } = useChildren();
  const { data: groups } = useGroups();
  const createBooking = useCreateChildBooking();

  useEffect(() => {
    if (selectedDate) {
      setDate(selectedDate.toISOString().split("T")[0]);
    }
  }, [selectedDate]);

  const resetForm = () => {
    setChildId("");
    setGroupId("");
    setStartTime("08:00");
    setEndTime("16:00");
    setIsExtra(false);
    setNotes("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!childId || !date || !startTime || !endTime) return;

    try {
      await createBooking.mutateAsync({
        childId,
        groupId: groupId || null,
        date,
        startTime,
        endTime,
        isExtra,
        notes: notes || null,
      });
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Fehler beim Erstellen der Buchung");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Neue Buchung</h3>
          <button onClick={() => onOpenChange(false)} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="label">Kind *</label>
            <select value={childId} onChange={(e) => setChildId(e.target.value)} className="select w-full" required>
              <option value="">Kind auswählen</option>
              {children?.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.firstName} {child.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Gruppe</label>
            <select value={groupId} onChange={(e) => setGroupId(e.target.value)} className="select w-full">
              <option value="">Gruppe auswählen</option>
              {groups?.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Datum *</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Von *</label>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="input" required />
            </div>
            <div>
              <label className="label">Bis *</label>
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="input" required />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={isExtra} onChange={(e) => setIsExtra(e.target.checked)} />
            Zusatzbuchung (außerhalb des Vertrags)
          </label>

          <div>
            <label className="label">Notizen</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="textarea" rows={2} />
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" className="btn btn-ghost" onClick={() => onOpenChange(false)}>
              Abbrechen
            </button>
            <button type="submit" disabled={createBooking.isPending} className="btn btn-primary">
              {createBooking.isPending ? "Speichern..." : "Speichern"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
