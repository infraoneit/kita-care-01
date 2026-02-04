import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KitaCare Enterprise",
  description: "Enterprise Kita Administration System",
  manifest: "/manifest.json",
  themeColor: "#E91E8C",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
