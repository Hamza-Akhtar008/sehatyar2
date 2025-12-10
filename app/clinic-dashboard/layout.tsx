"use client";
import { ClinicDashboardLayout } from "@/components/clinic-dashboard-layout";
import { Toaster } from "sonner";
import RoleGuard from "@/components/RoleGuard";
import { UserRole } from "@/lib/types";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={[UserRole.CLINIC]}>
      <ClinicDashboardLayout>
        <Toaster richColors position="top-right" />
        {children}
      </ClinicDashboardLayout>
    </RoleGuard>
  );
}
