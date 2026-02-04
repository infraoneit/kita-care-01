"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Home,
  Calendar,
  Receipt,
  FileText,
  Mail,
  UserCog,
  Settings,
  BarChart3,
  ClipboardList,
  ListChecks,
} from "lucide-react";

const modules = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Verwaltung", href: "/verwaltung", icon: ListChecks },
  { name: "Belegung", href: "/bookings", icon: Calendar },
  { name: "Rechnungen", href: "/invoices", icon: Receipt },
  { name: "Listen", href: "/reports", icon: BarChart3 },
  { name: "Formulare", href: "/forms", icon: FileText },
  { name: "Kommunikation", href: "/communication", icon: Mail },
  { name: "Personal", href: "/staff", icon: UserCog },
  { name: "Admin", href: "/admin", icon: Settings },
  { name: "Checklisten", href: "/checklists", icon: ClipboardList },
];

export function TopNavigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      document.body.classList.remove("overflow-hidden");
      return;
    }

    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-600 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">K</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">KitaCare</h1>
                <p className="text-xs text-gray-500">Enterprise</p>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {modules.map((module) => {
                const Icon = module.icon;
                const isActive = pathname === module.href || pathname.startsWith(module.href + "/");

                return (
                  <Link
                    key={module.href}
                    href={module.href}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${isActive ? "bg-pink-50 text-pink-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{module.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Navigation öffnen"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              <span className="sr-only">Navigation öffnen</span>
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            </button>
            <form action="/api/auth/logout" method="POST">
              <button type="submit" className="text-sm text-gray-600 hover:text-gray-900">
                Abmelden
              </button>
            </form>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Navigation schließen"
          />
          <aside
            id="mobile-navigation"
            className="absolute right-0 top-0 h-full w-72 bg-white shadow-xl flex flex-col"
            aria-label="Mobile Navigation"
          >
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
              <span className="text-sm font-semibold text-gray-900">Navigation</span>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Navigation schließen"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="6" y1="18" x2="18" y2="6" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {modules.map((module) => {
                const Icon = module.icon;
                const isActive = pathname === module.href || pathname.startsWith(module.href + "/");

                return (
                  <Link
                    key={module.href}
                    href={module.href}
                    className={`
                      flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${isActive ? "bg-pink-50 text-pink-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{module.name}</span>
                  </Link>
                );
              })}
            </div>
          </aside>
        </div>
      )}
    </nav>
  );
}
