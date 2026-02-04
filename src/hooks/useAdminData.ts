"use client";

import { useEffect, useMemo, useState } from "react";

function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (isMounted) setData(json);
      })
      .catch(() => {
        if (isMounted) setData(null);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [url]);

  return { data, isLoading };
}

export function useGroups() {
  return useFetch<Array<{ id: string; name: string; color?: string }>>("/api/groups");
}

export function useChildren() {
  return useFetch<Array<{ id: string; firstName: string; lastName: string }>>("/api/children");
}

export function useStaff() {
  return useFetch<Array<{ id: string; firstName: string; lastName: string; position?: string }>>("/api/staff");
}

export function useChildBookings(startDate: string, endDate: string) {
  const url = useMemo(() => `/api/bookings?start=${encodeURIComponent(startDate)}&end=${encodeURIComponent(endDate)}`, [startDate, endDate]);
  return useFetch<any[]>(url);
}

export function useStaffShifts(startDate: string, endDate: string) {
  const url = useMemo(() => `/api/staff-shifts?start=${encodeURIComponent(startDate)}&end=${encodeURIComponent(endDate)}`, [startDate, endDate]);
  return useFetch<any[]>(url);
}

export function useCreateChildBooking() {
  const [isPending, setIsPending] = useState(false);

  async function mutateAsync(payload: any) {
    setIsPending(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Fehler beim Speichern");
      return res.json();
    } finally {
      setIsPending(false);
    }
  }

  return { mutateAsync, isPending };
}

export function useCreateStaffShift() {
  const [isPending, setIsPending] = useState(false);

  async function mutateAsync(payload: any) {
    setIsPending(true);
    try {
      const res = await fetch("/api/staff-shifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Fehler beim Speichern");
      return res.json();
    } finally {
      setIsPending(false);
    }
  }

  return { mutateAsync, isPending };
}
