"use client";

import { useMemo, useState } from "react";
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isToday, addWeeks, subWeeks, addMonths, subMonths } from "date-fns";
import { de } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus, Baby, UserCog } from "lucide-react";
import { BookingDialog } from "@/components/belegung/BookingDialog";
import { ShiftDialog } from "@/components/belegung/ShiftDialog";
import { useChildBookings, useGroups, useStaffShifts } from "@/hooks/useAdminData";
import { cn } from "@/lib/utils";

type ViewMode = "day" | "week" | "month";
type DisplayMode = "children" | "staff";

export default function BookingsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [displayMode, setDisplayMode] = useState<DisplayMode>("children");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [shiftDialogOpen, setShiftDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const { data: groups } = useGroups();

  const dateRange = useMemo(() => {
    if (viewMode === "day") {
      return { start: currentDate, end: currentDate };
    }
    if (viewMode === "week") {
      return {
        start: startOfWeek(currentDate, { weekStartsOn: 1 }),
        end: endOfWeek(currentDate, { weekStartsOn: 1 }),
      };
    }
    return { start: startOfMonth(currentDate), end: endOfMonth(currentDate) };
  }, [currentDate, viewMode]);

  const startDate = format(dateRange.start, "yyyy-MM-dd");
  const endDate = format(dateRange.end, "yyyy-MM-dd");

  const { data: childBookings, isLoading: loadingBookings } = useChildBookings(startDate, endDate);
  const { data: staffShifts, isLoading: loadingShifts } = useStaffShifts(startDate, endDate);

  const days = useMemo(() => eachDayOfInterval({ start: dateRange.start, end: dateRange.end }), [dateRange]);

  const navigate = (direction: "prev" | "next") => {
    if (viewMode === "day") {
      setCurrentDate((prev) => (direction === "next" ? addDays(prev, 1) : addDays(prev, -1)));
    } else if (viewMode === "week") {
      setCurrentDate((prev) => (direction === "next" ? addWeeks(prev, 1) : subWeeks(prev, 1)));
    } else {
      setCurrentDate((prev) => (direction === "next" ? addMonths(prev, 1) : subMonths(prev, 1)));
    }
  };

  const getBookingsForDay = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return (
      childBookings?.filter((b: any) => {
        const bookingDate = format(new Date(b.date), "yyyy-MM-dd");
        const matchesGroup = selectedGroup === "all" || b.groupId === selectedGroup || b.group?.id === selectedGroup;
        return bookingDate === dateStr && matchesGroup;
      }) || []
    );
  };

  const getShiftsForDay = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return (
      staffShifts?.filter((s: any) => {
        const shiftDate = format(new Date(s.date), "yyyy-MM-dd");
        const matchesGroup = selectedGroup === "all" || s.groupId === selectedGroup || s.group?.id === selectedGroup;
        return shiftDate === dateStr && matchesGroup;
      }) || []
    );
  };

  const isLoading = displayMode === "children" ? loadingBookings : loadingShifts;
  const timeSlots = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

  const handleAddNew = () => {
    setSelectedDate(currentDate);
    if (displayMode === "children") {
      setBookingDialogOpen(true);
    } else {
      setShiftDialogOpen(true);
    }
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    if (displayMode === "children") {
      setBookingDialogOpen(true);
    } else {
      setShiftDialogOpen(true);
    }
  };

  return (
    <div className="min-h-screen pb-24 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Belegungsplan</h1>
          <p className="text-gray-600">
            {viewMode === "day"
              ? format(currentDate, "EEEE, d. MMMM yyyy", { locale: de })
              : viewMode === "week"
              ? `KW ${format(currentDate, "w", { locale: de })} • ${format(dateRange.start, "dd.MM.")} - ${format(dateRange.end, "dd.MM.yyyy")}`
              : format(currentDate, "MMMM yyyy", { locale: de })}
          </p>
        </div>
        <button className="btn btn-ghost" onClick={handleAddNew}>
          <Plus className="w-4 h-4 mr-2" />
          Neu
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          <button
            className={cn("px-3 py-2 text-sm flex items-center gap-1", displayMode === "children" ? "bg-pink-50 text-pink-600" : "text-gray-600")}
            onClick={() => setDisplayMode("children")}
          >
            <Baby size={14} />
            Kinder
          </button>
          <button
            className={cn("px-3 py-2 text-sm flex items-center gap-1", displayMode === "staff" ? "bg-pink-50 text-pink-600" : "text-gray-600")}
            onClick={() => setDisplayMode("staff")}
          >
            <UserCog size={14} />
            Personal
          </button>
        </div>

        <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} className="select h-9">
          <option value="all">Alle Gruppen</option>
          {groups?.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate("prev")}>
            <ChevronLeft size={20} />
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => setCurrentDate(new Date())}>
            Heute
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate("next")}>
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="flex gap-2">
          <button className={cn("btn btn-sm", viewMode === "day" ? "btn-primary" : "btn-outline")} onClick={() => setViewMode("day")}>Tag</button>
          <button className={cn("btn btn-sm", viewMode === "week" ? "btn-primary" : "btn-outline")} onClick={() => setViewMode("week")}>Woche</button>
          <button className={cn("btn btn-sm", viewMode === "month" ? "btn-primary" : "btn-outline")} onClick={() => setViewMode("month")}>Monat</button>
        </div>
      </div>

      {isLoading ? (
        <div className="card p-6 text-gray-500">Laden...</div>
      ) : viewMode === "day" ? (
        <div className="card">
          <div className="divide-y divide-gray-100">
            {timeSlots.map((time) => {
              const bookings = displayMode === "children"
                ? getBookingsForDay(currentDate).filter((b: any) => {
                    const startHour = parseInt(b.startTime?.split(":")[0] || "0");
                    const slotHour = parseInt(time.split(":")[0]);
                    const endHour = parseInt(b.endTime?.split(":")[0] || "0");
                    return slotHour >= startHour && slotHour < endHour;
                  })
                : getShiftsForDay(currentDate).filter((s: any) => {
                    const startHour = parseInt(s.startTime?.split(":")[0] || "0");
                    const slotHour = parseInt(time.split(":")[0]);
                    const endHour = parseInt(s.endTime?.split(":")[0] || "0");
                    return slotHour >= startHour && slotHour < endHour;
                  });

              return (
                <div key={time} className="flex cursor-pointer hover:bg-gray-50" onClick={() => handleDayClick(currentDate)}>
                  <div className="w-16 py-3 px-2 text-xs text-gray-500 border-r border-gray-100">{time}</div>
                  <div className="flex-1 py-2 px-2 min-h-[48px] flex flex-wrap gap-1">
                    {displayMode === "children"
                      ? bookings.map((b: any) => (
                          <span key={b.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white" style={{ backgroundColor: b.group?.color || "#4A9D8E" }}>
                            {b.child?.firstName} {b.child?.lastName?.[0]}.
                          </span>
                        ))
                      : bookings.map((s: any) => (
                          <span key={s.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white" style={{ backgroundColor: s.group?.color || "#E88D4E" }}>
                            {s.staff?.firstName} {s.staff?.lastName?.[0]}.
                          </span>
                        ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : viewMode === "week" ? (
        <div className="card overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-6 border-b border-gray-100">
              <div className="p-2 text-xs text-gray-500 border-r border-gray-100">Zeit</div>
              {days.slice(0, 5).map((day) => (
                <div
                  key={day.toISOString()}
                  className={cn("p-2 text-center border-r border-gray-100 last:border-r-0 cursor-pointer hover:bg-gray-50", isToday(day) && "bg-pink-50")}
                  onClick={() => handleDayClick(day)}
                >
                  <p className="text-xs text-gray-500">{format(day, "EEE", { locale: de })}</p>
                  <p className={cn("text-sm font-medium", isToday(day) && "text-pink-600")}>{format(day, "d")}</p>
                </div>
              ))}
            </div>
            {timeSlots.slice(0, 6).map((time) => (
              <div key={time} className="grid grid-cols-6 border-b border-gray-100 last:border-b-0">
                <div className="p-2 text-xs text-gray-500 border-r border-gray-100">{time}</div>
                {days.slice(0, 5).map((day) => {
                  const dayBookings = displayMode === "children"
                    ? getBookingsForDay(day).filter((b: any) => parseInt(b.startTime?.split(":")[0] || "0") === parseInt(time.split(":")[0]))
                    : getShiftsForDay(day).filter((s: any) => parseInt(s.startTime?.split(":")[0] || "0") === parseInt(time.split(":")[0]));

                  return (
                    <div
                      key={day.toISOString()}
                      className={cn("p-1 min-h-[40px] border-r border-gray-100 last:border-r-0 cursor-pointer hover:bg-gray-50", isToday(day) && "bg-pink-50/50")}
                      onClick={() => handleDayClick(day)}
                    >
                      {displayMode === "children"
                        ? dayBookings.slice(0, 2).map((b: any) => (
                            <div key={b.id} className="text-[10px] px-1 py-0.5 rounded mb-0.5 text-white truncate" style={{ backgroundColor: b.group?.color || "#4A9D8E" }}>
                              {b.child?.firstName}
                            </div>
                          ))
                        : dayBookings.slice(0, 2).map((s: any) => (
                            <div key={s.id} className="text-[10px] px-1 py-0.5 rounded mb-0.5 text-white truncate" style={{ backgroundColor: s.group?.color || "#E88D4E" }}>
                              {s.staff?.firstName}
                            </div>
                          ))}
                      {dayBookings.length > 2 && <div className="text-[10px] text-gray-400">+{dayBookings.length - 2}</div>}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card p-2">
          <div className="grid grid-cols-7 mb-2">
            {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: (dateRange.start.getDay() || 7) - 1 }).map((_, i) => (
              <div key={`pad-${i}`} className="aspect-square" />
            ))}
            {days.map((day) => {
              const dayData = displayMode === "children" ? getBookingsForDay(day) : getShiftsForDay(day);
              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "aspect-square p-1 rounded-lg text-center cursor-pointer hover:bg-gray-50 transition-colors",
                    isToday(day) && "bg-pink-600 text-white",
                    dayData.length > 0 && !isToday(day) && "bg-pink-50"
                  )}
                  onClick={() => handleDayClick(day)}
                >
                  <span className="text-xs font-medium">{format(day, "d")}</span>
                  {dayData.length > 0 && <div className="text-[9px] mt-0.5">{dayData.length} {displayMode === "children" ? "K" : "P"}</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="card p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-2xl font-bold text-pink-600">{displayMode === "children" ? childBookings?.length || 0 : staffShifts?.length || 0}</p>
            <p className="text-xs text-gray-500">{displayMode === "children" ? "Buchungen" : "Schichten"} im Zeitraum</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-cyan-600">
              {displayMode === "children"
                ? new Set((childBookings || []).map((b: any) => b.childId)).size
                : new Set((staffShifts || []).map((s: any) => s.staffId)).size}
            </p>
            <p className="text-xs text-gray-500">{displayMode === "children" ? "Kinder" : "Mitarbeiter"}</p>
          </div>
        </div>
      </div>

      <BookingDialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen} selectedDate={selectedDate} />
      <ShiftDialog open={shiftDialogOpen} onOpenChange={setShiftDialogOpen} selectedDate={selectedDate} />
    </div>
  );
}
