"use client";

import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user, isLoading, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!token) {
      router.push("/");
      return;
    }

    if (user && !allowedRoles.includes(user.role)) {
       // Redirect to appropriate dashboard based on their actual role
       if (user.role === UserRole.ADMIN) router.push("/admin-dashboard/clinics");
       else if (user.role === UserRole.DOCTOR) router.push("/"); // Placeholder
       else if (user.role === UserRole.RECEPTIONIST) router.push("/"); // Placeholder
       else if (user.role === UserRole.PATIENT) router.push("/"); // Placeholder
       else router.push("/");
    }
  }, [user, isLoading, token, router, allowedRoles]);

  if (isLoading) {
      return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
  }

  // If no user or role not allowed, don't render children (effect will redirect)
  if (!user || !allowedRoles.includes(user.role)) {
    return null; 
  }

  return <>{children}</>;
}
