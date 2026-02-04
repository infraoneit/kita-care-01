"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function LogDateSelector({ current }: { current: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/f6bdf313-ecb7-43ca-a07e-715146912be3', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'LogDateSelector.tsx:10', message: 'LogDateSelector mount', data: { current }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'pre-fix', hypothesisId: 'H2' }) }).catch(() => { });
    // #endregion agent log
  }, [current]);

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("logDate", value);
    const nextUrl = `${pathname}?${params.toString()}`;
    router.replace(nextUrl, { scroll: false });
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/f6bdf313-ecb7-43ca-a07e-715146912be3', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'LogDateSelector.tsx:20', message: 'LogDateSelector change', data: { value, next: nextUrl }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'pre-fix', hypothesisId: 'H2' }) }).catch(() => { });
    // #endregion agent log
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
