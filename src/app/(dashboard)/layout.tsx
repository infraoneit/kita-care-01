import { TopNavigation } from "./components/TopNavigation";
import { requireSession } from "@/core/session";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireSession();

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      <main className="max-w-[106rem] mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
