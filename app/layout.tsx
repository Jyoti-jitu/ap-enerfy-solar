import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import { AppShell } from "@/components/layout/shell";
import { AuthProvider } from "@/components/shared/PermissionGuard";
import { NavigationProgress } from "@/components/shared/navigation-progress";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0b1f1a",
};

export const metadata: Metadata = {
  title: "AP Enerfy Solar - Solar ERP & Billing Management System",
  description:
    "Production-grade Solar ERP and Billing Management System for rooftop and ground-mounted solar installations in Odisha.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="h-full bg-[#f8fafc] text-slate-900 font-sans antialiased" suppressHydrationWarning>
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
