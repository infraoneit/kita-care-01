"use client";

import { useEffect, useState } from "react";
import { useGroups, useStaff, useCreateStaffShift } from "@/hooks/useAdminData";

interface ShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate?: Date;
}

export function ShiftDialog({ open, onOpenChange, selectedDate }: ShiftDialogProps) {
  const [staffId, setStaffId] = useState("");
  const [groupId, setGroupId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("16:00");
  const [shiftType, setShiftType] = useState("FULL_DAY");
  const [breakMinutes, setBreakMinutes] = useState("30");
  const [notes, setNotes] = useState("");

  const { data: staff } = useStaff();
  const { data: groups } = useGroups();
  const createShift = useCreateStaffShift();

  useEffect(() => {
    if (selectedDate) {
      setDate(selectedDate.toISOString().split("T")[0]);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (shiftType === "MORNING") {
      setStartTime("07:00");
      setEndTime("13:00");
    } else if (shiftType === "AFTERNOON") {
      setStartTime("12:00");
      setEndTime("18:00");
    } else if (shiftType === "FULL_DAY") {
      setStartTime("08:00");
      setEndTime("16:30");
    }
  }, [shiftType]);

  const resetForm = () => {
    setStaffId("");
    setGroupId("");
    setStartTime("08:00");
    setEndTime("16:00");
    setShiftType("FULL_DAY");
    setBreakMinutes("30");
    setNotes("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffId || !date || !startTime || !endTime) return;

    try {
      await createShift.mutateAsync({
        staffId,
        groupId: groupId || null,
        date,
        startTime,
        endTime,
        shiftType,
        breakMinutes: parseInt(breakMinutes, 10) || 0,
        notes: notes || null,
      });
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error("Error creating shift:", error);
      alert("Fehler beim Erstellen der Schicht");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Neue Schicht</h3>
          <button onClick={() => onOpenChange(false)} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="label">Mitarbeiter *</label>
            <select value={staffId} onChange={(e) => setStaffId(e.target.value)} className="select w-full" required>
              <option value="">Mitarbeiter auswählen</option>
              {staff?.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.firstName} {member.lastName}
                  {member.position ? ` (${member.position})` : ""}
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

          <div>
            <label className="label">Schichttyp</label>
            <select value={shiftType} onChange={(e) => setShiftType(e.target.value)} className="select w-full">
              <option value="MORNING">Frühdienst</option>
              <option value="AFTERNOON">Spätdienst</option>
              <option value="FULL_DAY">Ganztags</option>
              <option value="CUSTOM">Individuell</option>
            </select>
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

          <div>
            <label className="label">Pause (Minuten)</label>
            <input type="number" value={breakMinutes} onChange={(e) => setBreakMinutes(e.target.value)} className="input" min="0" max="120" />
          </div>

          <div>
            <label className="label">Notizen</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="textarea" rows={2} />
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" className="btn btn-ghost" onClick={() => onOpenChange(false)}>
              Abbrechen
            </button>
            <button type="submit" disabled={createShift.isPending} className="btn btn-primary">
              {createShift.isPending ? "Speichern..." : "Speichern"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
