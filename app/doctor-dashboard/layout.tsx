"use client";
import { Toaster } from "sonner";

import { DoctorDashboardLayout } from "@/components/doctor-dashboard-layout";
import RoleGuard from "@/components/RoleGuard";
import { UserRole } from "@/lib/types";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={[UserRole.DOCTOR || UserRole.CLINICDOCTOR || UserRole.INDIVIDUALDOCTOR]}>
      <DoctorDashboardLayout>
        <Toaster richColors position="top-right" />
        {children}
      </DoctorDashboardLayout>
    </RoleGuard>
  );
}
