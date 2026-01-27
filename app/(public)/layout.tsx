import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat, Plus_Jakarta_Sans, Inter } from "next/font/google";
import "../globals.css";


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

import { ReactNode, Suspense } from "react";
import  Footer2 from "@/components/landing/Footer2";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/landing";
import Header from "@/components/landing/Header";


interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <div className={`min-h-screen bg-white ${montserrat.variable} ${plusJakarta.variable} ${inter.variable} ${geistSans.variable} ${geistMono.variable} font-plusjakarta`}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        forcedTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        <Header />
        <Suspense>
          <main>{children}</main>
          <Footer />
          <Footer2 />
        </Suspense>
      </ThemeProvider>
    </div>
  );
}

