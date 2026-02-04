"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function LogDateSelector({ current }: { current: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {}, [current]);

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("logDate", value);
    const nextUrl = `${pathname}?${params.toString()}`;
    router.replace(nextUrl, { scroll: false });
  };

  return (
    <select
      name="logDate"
      className="select select-sm"
      value={current}
      onChange={(e) => handleChange(e.target.value)}
    >
      <option value="today">Heute</option>
      <option value="yesterday">Gestern</option>
      <option value="daybefore">Vorgestern</option>
    </select>
  );
}
