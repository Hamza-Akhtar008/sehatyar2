"use client";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Toaster } from "sonner";
import RoleGuard from "@/components/RoleGuard";
import { UserRole } from "@/lib/types";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={[UserRole.PATIENT, UserRole.DOCTOR, UserRole.RECEPTIONIST, UserRole.CLINIC]}>
      <DashboardLayout>
        <Toaster richColors position="top-right" />
        {children}
      </DashboardLayout>
    </RoleGuard>
  );
}
