import ThemeProvider from "@/lib/provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sehatyar - Clinic Management System",
  description: "Modern clinic management system for healthcare professionals",
 
};

import { AuthProvider } from "@/context/AuthContext";
import { LocationProvider } from "@/src/contexts/LocationContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <LocationProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </LocationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}