import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat, Plus_Jakarta_Sans, Inter } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300","400","500","600","700","800"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plusjakarta",
  subsets: ["latin"],
  weight: ["500", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sehat Yar",
  description: "A medical plateform",
};

import { ReactNode } from "react";
import Header from "@/components/ui/header";
import { Toaster } from "react-hot-toast";


interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  // This is a nested layout — do NOT render <html> or <body> here.
  // The root `app/layout.tsx` must be the only place rendering <html> and <body>.
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        forcedTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        {/* <Header /> */}
        <div className="min-h-screen bg-white text-gray-900">
          <main>
            {children}
            <Toaster position="top-right" />
          </main>
        </div>
      </ThemeProvider>
    </>
  );
}
