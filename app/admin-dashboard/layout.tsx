"use client";
import { Toaster } from "sonner";
import { AdminDashboardLayout } from "@/components/Admin-dashboard-layout";
import RoleGuard from "@/components/RoleGuard";
import { UserRole } from "@/lib/types";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={[UserRole.ADMIN]}>
        <AdminDashboardLayout>
        <Toaster richColors position="top-right" />
        {children}
        </AdminDashboardLayout>
    </RoleGuard>
  );
}
