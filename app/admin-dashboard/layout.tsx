"use client";
import { Toaster } from "sonner";
import { AdminDashboardLayout } from "@/components/Admin-dashboard-layout";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminDashboardLayout>
      <Toaster richColors position="top-right" />
      {children}
    </AdminDashboardLayout>
  );
}
