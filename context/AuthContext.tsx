"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserRole } from "@/lib/types";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: number;
  email: string;
  name?: string;
  fullName?: string;
  role: UserRole;
  access_token?: string;
  doctorId?: string | number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check local storage on initial load
    const storedToken = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("user_data");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, userData: User) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem("access_token", newToken);
    localStorage.setItem("user_data", JSON.stringify(userData));

    // Redirect based on role
    if (userData.role === UserRole.ADMIN) {
      router.push("/admin-dashboard"); // Assuming clinics is the default view for admin
    } else if (userData.role === UserRole.DOCTOR || userData.role === UserRole.CLINICDOCTOR || userData.role === UserRole.INDIVIDUALDOCTOR) {
      // Assuming doctor dashboard exists, otherwise redirect to home/safe page
      router.push("/doctor-dashboard");
    } else if (userData.role === UserRole.RECEPTIONIST || userData.role === UserRole.CLINICRECEPTIONIST) {
      router.push("/receptionist-dashboard");
    } else if (userData.role === UserRole.PATIENT) {
      router.push("/patient-dashboard");
    } else if (userData.role === UserRole.CLINIC) {
      router.push("/clinic-dashboard");
    }
    else {
      router.push("/");
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_data");
    router.push("/");
  };

  // Role based route protection logic could be here or in layout. 
  // Implementing basic protection here to ensure redirection if unauthorized.
  // useEffect(() => {
  //   if (isLoading) return;

  //   const isPublicRoute = pathname === "/" || pathname === "/auth/register" || pathname === "/auth/forgot-password";

  //   // If not logged in and trying to access protected route (assuming all non-public are protected)
  //   if (!token && !isPublicRoute) {
  //       // e.g. /admin-dashboard should redirect to /
  //       // router.push("/"); 
  //       // User specifically asked for layout allowed roles, so we will handle strict checks there.
  //       // But basic check:
  //   }

  //   // If logged in, prevent access to login page
  //   if (token && isPublicRoute) {
  //        if (user?.role === UserRole.ADMIN) {
  //            router.push("/admin-dashboard");
  //        } else if (user?.role === UserRole.DOCTOR || user?.role === UserRole.CLINICDOCTOR || user?.role === UserRole.INDIVIDUALDOCTOR) {
  //            router.push("/doctor-dashboard");
  //        } else if (user?.role === UserRole.RECEPTIONIST || user?.role === UserRole.CLINICRECEPTIONIST) {
  //            router.push("/receptionist-dashboard");
  //        } else if (user?.role === UserRole.PATIENT) {
  //            router.push("/patient-dashboard");
  //        } else if (user?.role === UserRole.CLINIC) {
  //            router.push("/clinic-dashboard");
  //        }
  //   }

  // }, [token, pathname, isLoading, user]);


  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
