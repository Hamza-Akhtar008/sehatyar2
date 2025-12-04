"use client";
import { Toaster } from "sonner";
import { PatientDashboardLayout } from "@/components/patient-dashboard-layout";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <PatientDashboardLayout>
      <Toaster richColors position="top-right" />
      {children}
    </PatientDashboardLayout>
  );
}
