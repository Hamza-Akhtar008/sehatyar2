"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronDownIcon, ArrowRight, User, Settings, LogOut, Menu, X } from "lucide-react";
import { UserRole } from "@/lib/types";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;
  const [language, setLanguage] = useState("EN");
  
  useEffect(() => {
    const originalBodyBg = document.body.style.backgroundColor;
    const originalHtmlBg = document.documentElement.style.backgroundColor;

    document.body.style.backgroundColor = "white";
    document.documentElement.style.backgroundColor = "white";
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("no-scrollbar");

    return () => {
      document.body.style.backgroundColor = originalBodyBg;
      document.documentElement.style.backgroundColor = originalHtmlBg;
      document.documentElement.classList.remove("no-scrollbar");
    };
  }, []);

  const getDashboardRoute = (user: any) => {
    if (!user) return "/";
    switch (user.role) {
      case UserRole.ADMIN:
      case UserRole.SUPERADMIN:
        return "/admin-dashboard";
      case UserRole.DOCTOR:
      case UserRole.CLINICDOCTOR:
      case UserRole.INDIVIDUALDOCTOR:
        return "/doctor-dashboard";
      case UserRole.RECEPTIONIST:
      case UserRole.CLINICRECEPTIONIST:
        return "/receptionist-dashboard";
      case UserRole.PATIENT:
        return "/patient-dashboard";
      case UserRole.CLINIC:
        return "/clinic-dashboard";
      default:
        return "/";
    }
  };

  const specialties = [
    {
      name: "Cardiology",
      cities: [
        "Cardiologist in Abbottobad",
        "Cardiologist in Lahore",
        "Cardiologist in Islamabad",
      ],
    },
    {
      name: "Gynecology",
      cities: [
        "Gynecologist in Abbottobad",
        "Gynecologist in Lahore",
        "Gynecologist in Islamabad",
      ],
    },
    {
      name: "Urology",
      cities: [
        "Urologist in Abbottobad",
        "Urologist in Lahore",
        "Urologist in Islamabad",
      ],
    },
    {
      name: "Gastroenterology",
      cities: [
        "Gastroenterologist in Abbottobad",
        "Gastroenterologist in Lahore",
        "Gastroenterologist in Islamabad",
      ],
    },
    {
      name: "Neurology",
      cities: [
        "Neurologist in Abbottobad",
        "Neurologist in Lahore",
        "Neurologist in Islamabad",
      ],
    },
    {
      name: "Dental Surgery",
      cities: [
        "Dental Surgery in Abbottobad",
        "Dental Surgery in Lahore",
        "Dental Surgery in Islamabad",
      ],
    },
  ];

  const [expanded, setExpanded] = useState<string | null>(null);

  const clinics = [
    {
      name: "Lahore Clinics",
      hospitals: [
        "Doctors Hospital",
        "Hameed Latif Hospital",
        "Evercare Hospital",
      ],
    },
    {
      name: "Karachi Clinics",
      hospitals: [
        "Agha Khan Hospital",
        "South City Hospital",
        "Liaquat National Hospital",
      ],
    },
    {
      name: "Islamabad Clinics",
      hospitals: [
        "Shifa International",
        "PIMS Hospital",
        "Ali Medical Centre",
      ],
    },
  ];

  const [mobileDoctorsOpen, setMobileDoctorsOpen] = useState<boolean>(false);
  const [mobileClinicsOpen, setMobileClinicsOpen] = useState<boolean>(false);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-[1370px] mx-auto my-3 px-4 lg:px-0">
        <div className="relative flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="/logos/main-logo.svg"
                alt="Sehatyar logo"
                width={200}
                height={52}
                priority
                className="h-[38px] md:h-[52px] w-auto" 
              />
            </Link>
          </div>

          <nav className="hidden lg:flex items-center space-x-8 absolute left-1/2 -translate-x-1/2">
            {/* Doctors Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="font-montserrat flex items-center gap-1 text-gray-700 hover:text-gray-900 font-medium text-base transition-colors bg-transparent border-none outline-none">
                Doctors
                <ChevronDownIcon className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-white shadow-lg rounded-lg p-2 font-plusjakarta border-none">
                {specialties.map((spec) => (
                  <div key={spec.name} className="mb-1">
                    <button
                      className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                      onClick={() => setExpanded(expanded === spec.name ? null : spec.name)}
                      type="button"
                    >
                      {spec.name}
                      <ChevronDownIcon
                        className={`w-4 h-4 transition-transform ${
                          expanded === spec.name ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {expanded === spec.name && (
                      <div className="ml-4 mt-1 space-y-1">
                        {spec.cities.map((city) => (
                          <Link
                            key={city}
                            href={{
                              pathname: "/doctor",
                              query: {
                                query: spec.name,
                                city: city.split(" in ")[1],
                              },
                            }}
                            className="block px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                          >
                            {city}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Clinics Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="font-montserrat flex items-center gap-1 text-gray-700 hover:text-gray-900 font-medium text-base transition-colors bg-transparent border-none outline-none">
                Clinics
                <ChevronDownIcon className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-white shadow-lg rounded-lg p-2 font-plusjakarta border-none">
                {clinics.map((city) => (
                  <div key={city.name} className="mb-1">
                    <button
                      className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                      onClick={() => setExpanded(expanded === city.name ? null : city.name)}
                      type="button"
                    >
                      {city.name}
                      <ChevronDownIcon
                        className={`w-4 h-4 transition-transform ${
                          expanded === city.name ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {expanded === city.name && (
                      <div className="ml-4 mt-1 space-y-1">
                        {city.hospitals.map((hospital) => (
                          <div
                            key={hospital}
                            className="block px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                          >
                            {hospital}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Regular Links */}
            <Link
              href="/how-it-works"
              className="font-montserrat flex items-center gap-1 text-gray-700 hover:text-gray-900 font-medium text-base transition-colors"
            >
              How it Works
            </Link>

            <Link
              href="/about-us"
              className="font-montserrat flex items-center gap-1 text-gray-700 hover:text-gray-900 font-medium text-base transition-colors"
            >
              About Us
            </Link>

            <Link
              href="/contact"
              className="font-montserrat flex items-center gap-1 text-gray-700 hover:text-gray-900 font-medium text-base transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger className="font-montserrat flex items-center gap-1 text-gray-700 hover:text-gray-900 font-medium text-base transition-colors bg-transparent border-none outline-none">
                {language}
                <ChevronDownIcon className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white shadow-lg rounded-lg p-1 min-w-[80px] border-none">
                <DropdownMenuItem
                  onClick={() => setLanguage("EN")}
                  className="cursor-pointer hover:bg-gray-50 rounded-md"
                >
                  EN
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage("UR")}
                  className="cursor-pointer hover:bg-gray-50 rounded-md"
                >
                  UR
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors border-none outline-none">
                  <User className="w-5 h-5 text-gray-700" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white shadow-lg rounded-lg p-1 w-48">
                  <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50 rounded-md text-gray-700 focus:text-gray-900">
                    <Link href={getDashboardRoute(user)} className="flex items-center gap-2 w-full">
                      <Settings className="w-4 h-4" /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50 rounded-md text-gray-700 focus:text-gray-900">
                    <button onClick={logout} className="flex items-center gap-2 w-full text-left">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-6 py-3.5 border-[1.5px] border-black rounded-full text-black hover:bg-gray-50 font-medium text-sm transition-colors"
                >
                  Login / Sign Up
                </Link>

                <Link
                  href="/register"
                  className="pl-6 pr-2 py-1 bg-[#4E148C] text-white hover:bg-[#ff6600] rounded-full text-sm transition-colors flex items-center gap-3"
                >
                  Join as Doctor
                 <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="44" height="44" rx="22" fill="white"/>
<path d="M18.5919 23.8798L25.4073 20.1197M25.4073 20.1197L21.3475 18.8036M25.4073 20.1197L24.3556 24.256" stroke="#4E148C" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button + Join as Doctor */}
          <div className="lg:hidden flex items-center gap-3">
            <Link
              href="/register"
              className="pl-3 sm:pl-4 pr-1 sm:pr-2 py-1.5 sm:py-2 bg-[#4E148C] text-white hover:bg-[#ff6600] rounded-full text-[11px] sm:text-sm font-medium transition-colors flex items-center gap-1.5 sm:gap-2"
            >
              Join as Doctor
              <svg width="20" height="20" className="sm:w-[24px] sm:h-[24px]" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="44" height="44" rx="22" fill="white"/>
                <path d="M18.5919 23.8798L25.4073 20.1197M25.4073 20.1197L21.3475 18.8036M25.4073 20.1197L24.3556 24.256" stroke="#4E148C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <button
              className="p-2 text-gray-700 hover:text-gray-900 transition-colors"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-4 space-y-3">
            {/* Doctors Mobile */}
            <div>
              <button
                className="w-full flex items-center justify-between py-2 text-gray-700 font-medium"
                onClick={() => setMobileDoctorsOpen(!mobileDoctorsOpen)}
                type="button"
              >
                Doctors
                <ChevronDownIcon
                  className={`w-5 h-5 transition-transform ${
                    mobileDoctorsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {mobileDoctorsOpen && (
                <div className="pl-4 mt-2 space-y-2">
                  {specialties.map((spec) => (
                    <div key={spec.name}>
                      <button
                        className="w-full flex items-center justify-between py-2 text-sm text-gray-600"
                        onClick={() => setExpanded(expanded === spec.name ? null : spec.name)}
                        type="button"
                      >
                        {spec.name}
                        <ChevronDownIcon
                          className={`w-4 h-4 transition-transform ${
                            expanded === spec.name ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {expanded === spec.name && (
                        <div className="pl-4 space-y-1">
                          {spec.cities.map((city) => (
                            <Link
                              key={city}
                              href={{
                                pathname: "/doctor",
                                query: {
                                  query: spec.name,
                                  city: city.split(" in ")[1],
                                },
                              }}
                              className="block py-1 text-sm text-gray-500"
                            >
                              {city}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Clinics Mobile */}
            <div>
              <button
                className="w-full flex items-center justify-between py-2 text-gray-700 font-medium"
                onClick={() => setMobileClinicsOpen(!mobileClinicsOpen)}
                type="button"
              >
                Clinics
                <ChevronDownIcon
                  className={`w-5 h-5 transition-transform ${
                    mobileClinicsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {mobileClinicsOpen && (
                <div className="pl-4 mt-2 space-y-2">
                  {clinics.map((city) => (
                    <div key={city.name}>
                      <button
                        className="w-full flex items-center justify-between py-2 text-sm text-gray-600"
                        onClick={() => setExpanded(expanded === city.name ? null : city.name)}
                        type="button"
                      >
                        {city.name}
                        <ChevronDownIcon
                          className={`w-4 h-4 transition-transform ${
                            expanded === city.name ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {expanded === city.name && (
                        <div className="pl-4 space-y-1">
                          {city.hospitals.map((hospital) => (
                            <div key={hospital} className="block py-1 text-sm text-gray-500">
                              {hospital}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Other Links */}
            <Link href="/how-it-works" className="block py-2 text-gray-700 font-medium">
              How it Works
            </Link>
            <Link href="/about-us" className="block py-2 text-gray-700 font-medium">
              About Us
            </Link>
            <Link href="/contact" className="block py-2 text-gray-700 font-medium">
              Contact
            </Link>

            {/* Mobile Auth Buttons */}
            {!isAuthenticated && (
              <div className="pt-4 border-t border-gray-100">
                <Link
                  href="/login"
                  className="block w-full text-center px-6 py-2.5 border border-gray-300 rounded-full text-gray-700 font-medium"
                >
                  Login / Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
