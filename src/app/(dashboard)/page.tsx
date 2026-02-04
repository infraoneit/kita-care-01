import Link from "next/link";
import { Calendar, ListChecks } from "lucide-react";
import { requireSession } from "@/core/session";

export default async function DashboardPage() {
  await requireSession();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Schnellzugriff auf die Kernmodule</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/verwaltung" className="card p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Verwaltung</p>
              <p className="text-xl font-bold text-gray-900">Kinder & Partner</p>
            </div>
            <ListChecks className="w-8 h-8 text-pink-500" />
          </div>
        </Link>
        <Link href="/bookings" className="card p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Belegung</p>
              <p className="text-xl font-bold text-gray-900">Kalender</p>
            </div>
            <Calendar className="w-8 h-8 text-green-500" />
          </div>
        </Link>
      </div>
    </div>
  );
}
