"use client";
import { Toaster } from "sonner";
import { PatientDashboardLayout } from "@/components/patient-dashboard-layout";
import RoleGuard from "@/components/RoleGuard";
import { UserRole } from "@/lib/types";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={[UserRole.PATIENT]}>
      <PatientDashboardLayout>
        <Toaster richColors position="top-right" />
        {children}
      </PatientDashboardLayout>
    </RoleGuard>
  );
}
