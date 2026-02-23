"use client";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Image from "next/image";
import { ArrowRight, Search, MapPin } from "lucide-react";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "../ui/dialog";
import ConsultOnline from "./consult-online";
import InClinicAppointment from "./in-clinic-appointment";
import { useLocation } from "@/src/contexts/LocationContext";

const specializations = [
  "Allergy and Immunology",
  "Anesthesiology",
  "Cardiology",
  "Dermatology",
  "Endocrinology",
  "Gastroenterology",
  "General Surgery",
  "Hematology",
  "Infectious Disease",
  "Internal Medicine",
  "Nephrology",
  "Neurology",
  "Obstetrics & Gynecology",
  "Gynecology",
  "Gynecologist",
  "Oncology",
  "Ophthalmology",
  "Orthopedic Surgery",
  "Otolaryngology (ENT)",
  "Pediatrics",
  "Plastic Surgery",
  "Psychiatry",
  "Pulmonology",
  "Radiology",
  "Rheumatology",
  "Urology",
];

export default function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  
  // Use global location context
  const { 
    city, 
    setCity, 
    citySuggestions, 
    getCitySuggestions, 
    clearCitySuggestions 
  } = useLocation();
  
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [isInClinicModalOpen, setIsInClinicModalOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number } | null>(null);

  const updateDropdownPos = useCallback(() => {
    if (searchInputRef.current) {
      const rect = searchInputRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 8, left: rect.left, width: rect.width });
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      updateDropdownPos();
      window.addEventListener('scroll', updateDropdownPos, true);
      window.addEventListener('resize', updateDropdownPos);
      return () => {
        window.removeEventListener('scroll', updateDropdownPos, true);
        window.removeEventListener('resize', updateDropdownPos);
      };
    }
  }, [isFocused, updateDropdownPos]);
  
  // City autocomplete UI state (local, not shared)
  const [isCityFocused, setIsCityFocused] = useState(false);
  const [cityFocusedIndex, setCityFocusedIndex] = useState(-1);
  const cityDropdownRef = useRef<HTMLDivElement>(null);

  // Handle city input change with autocomplete (uses global context)
  const handleCityInputChange = useCallback((value: string) => {
    setCity(value);
    setCityFocusedIndex(-1);
    getCitySuggestions(value);
  }, [setCity, getCitySuggestions]);

  // Handle city keyboard navigation
  const handleCityKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!citySuggestions.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCityFocusedIndex((prev) => (prev + 1) % citySuggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCityFocusedIndex((prev) => (prev - 1 + citySuggestions.length) % citySuggestions.length);
    } else if (e.key === "Enter" && cityFocusedIndex >= 0) {
      e.preventDefault();
      // Extract just the city name from the full suggestion
      const selectedCity = citySuggestions[cityFocusedIndex].split(",")[0];
      setCity(selectedCity);
      clearCitySuggestions();
      setIsCityFocused(false);
    }
  };

  // Filter suggestions based on user input
  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    return specializations.filter((item) =>
      item.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!filtered.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter" && focusedIndex >= 0) {
      e.preventDefault();
      setQuery(filtered[focusedIndex]);
      setIsFocused(false);
    }
  };

  // Hide dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCityFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    router.push(
      `/doctor?query=${encodeURIComponent(query)}&city=${encodeURIComponent(
        city
      )}`
    );
  };

  return (
    <section aria-label="Hero section" className="max-w-[1370px] mx-auto mt-10 px-4 md:px-0 relative">
      {/* Main Hero Container */}
      <div className="relative bg-[#F4F4F4] rounded-[32px] md:rounded-[42px] overflow-hidden min-h-[400px] md:min-h-[450px] lg:min-h-[500px] flex items-center">
        {/* Mobile Background Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-mobile.svg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover md:hidden"
        />
        {/* Desktop Background Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-backgound.svg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover hidden md:block"
        />
        <div className="relative z-10 w-full">
          <div className="flex flex-col md:flex-row items-center">
            {/* Left Content */}
            <div className="w-full md:w-1/2 md:ml-6 lg:ml-8 md:mt-2 lg:mt-3 px-6 py-8 md:py-0">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white border-none px-3 py-1.5 mb-5 rounded-full shadow-sm">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF6600]"></div>
                <span className="text-gray-600 text-sm font-medium">
                  50M+ patients served
                </span>
              </div>

              {/* Heading */}
              <div className="space-y-1 md:text-left mb-6 md:mb-0">
                <h1 className="text-4xl sm:text-3xl md:text-3xl lg:text-5xl font-bold text-[#4E148C] leading-tight">
                  Find and Book the
                </h1>
                <h1 className="text-4xl sm:text-3xl md:text-3xl lg:text-5xl font-bold leading-tight">
                  <span className="text-[#FF6600]">Best Doctors</span>{" "}
                  <span className="text-[#4E148C]">near you</span>
                </h1>
              </div>

              {/* Mobile Location Dropdown */}
              <div className="md:hidden w-full max-w-md mb-2 relative">
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-5 h-5 text-gray-700" />
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={city}
                      readOnly
                      onClick={() => setIsInClinicModalOpen(true)}
                      placeholder="Select City"
                      className="bg-transparent border-none outline-none text-gray-700 text-base font-medium cursor-pointer p-0 h-auto focus-visible:outline-none w-full"
                    />InClin
                    {isCityFocused && citySuggestions.length > 0 && (
                      <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden max-h-48 overflow-y-auto">
                        {citySuggestions.map((suggestion, index) => (
                          <div
                            key={suggestion}
                            onMouseDown={() => {
                              const selectedCity = suggestion.split(",")[0];
                              setCity(selectedCity);
                              clearCitySuggestions();
                              setIsCityFocused(false);
                            }}
                            className={`px-4 py-3 text-sm cursor-pointer transition-colors flex items-center gap-2 ${
                              index === cityFocusedIndex
                                ? "bg-[#4E148C] text-white"
                                : "hover:bg-gray-50 text-gray-700"
                            }`}
                          >
                            <MapPin className={`w-3 h-3 ${index === cityFocusedIndex ? "text-white" : "text-gray-400"}`} />
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile Search Bar */}
              <div className="md:hidden w-full max-w-md">
                <div className="bg-white p-2 sm:p-4 rounded-[22px] shadow-lg border border-gray-200 flex items-center gap-1 sm:gap-2">
                  <div className="flex-1 bg-[#F5F5F5] rounded-[22px] px-3 py-4 flex items-center gap-1.5">
                    <Search className="w-4 h-4 text-gray-700" />
                    <input
                      type="text"
                      placeholder="Doctors, Hospital, Specialties"
                      value={query}
                      readOnly
                      onClick={() => setIsInClinicModalOpen(true)}
                      className="border-none bg-transparent p-0 h-auto focus-visible:outline-none placeholder:text-gray-600 text-gray-700 text-sm w-full cursor-pointer"
                    />
                  </div>
                  <Button
                    onClick={handleSearch}
                    className="btn-wipe-up bg-[#4E148C] text-white rounded-[22px] px-6 sm:px-10 py-4 h-auto text-sm font-medium"
                  >
                    Search
                  </Button>
                </div>
              </div>

              {/* Desktop Search Bar */}
              <div
                className="hidden md:flex bg-white p-2 shadow-lg w-full border rounded-full border-gray-100 flex-row gap-2 mt-4 overflow-visible"
                ref={dropdownRef}
              >
                <div className="flex-1 relative bg-[#F4F4F4] rounded-full px-4 py-2 flex items-center gap-2 overflow-visible" ref={searchInputRef}>
                  <Search className="w-5 h-5 text-gray-700" />
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Specialist or Hospital"
                      value={query}
                      readOnly
                      onClick={() => setIsInClinicModalOpen(true)}
                      className="border-none bg-transparent p-0 h-auto focus-visible:outline-none placeholder:text-gray-600 placeholder:text-sm placeholder:font-medium text-gray-700 text-base w-full cursor-pointer"
                    />
                  </div>
                  {isFocused && filtered.length > 0 && dropdownPos && createPortal(
                    <div
                      style={{ position: 'fixed', top: dropdownPos.top, left: dropdownPos.left, width: dropdownPos.width, zIndex: 99999 }}
                      className="bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    >
                      {filtered.map((item, index) => (
                        <div
                          key={item}
                          onMouseDown={() => {
                            setQuery(item);
                            setIsFocused(false);
                          }}
                          className={`px-4 py-3 text-sm cursor-pointer transition-colors ${
                            index === focusedIndex
                              ? "bg-[#4E148C] text-white"
                              : "hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  , document.body)}
                </div>

                <div className="flex-1 bg-[#F4F4F4] rounded-full px-4 py-2 flex items-center gap-2 relative" ref={cityDropdownRef}>
                  <div className="w-5 h-5 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-gray-700" />
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={city}
                      readOnly
                      onClick={() => setIsInClinicModalOpen(true)}
                      placeholder="Near you or Enter City"
                      className="border-none bg-transparent p-0 h-auto focus-visible:outline-none placeholder:text-gray-600 placeholder:text-sm placeholder:font-medium text-gray-700 text-base w-full cursor-pointer"
                    />
                    {isCityFocused && citySuggestions.length > 0 && (
                      <div className="absolute top-full left-0 mt-4 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto">
                        {citySuggestions.map((suggestion, index) => (
                          <div
                            key={suggestion}
                            onMouseDown={() => {
                              const selectedCity = suggestion.split(",")[0];
                              setCity(selectedCity);
                              clearCitySuggestions();
                              setIsCityFocused(false);
                            }}
                            className={`px-4 py-3 text-sm cursor-pointer transition-colors flex items-center gap-2 ${
                              index === cityFocusedIndex
                                ? "bg-[#4E148C] text-white"
                                : "hover:bg-gray-50 text-gray-700"
                            }`}
                          >
                            <MapPin className={`w-5 h-5 ${index === cityFocusedIndex ? "text-white" : "text-gray-400"}`} />
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  onClick={() => setIsInClinicModalOpen(true)}
                  className="btn-wipe-up bg-[#4E148C] text-white rounded-full px-6 lg:px-9 py-4 h-auto text-base font-medium"
                >
                  Search
                </Button>
              </div>
            </div>

            {/* Desktop Right Content - Images (inside gray container) */}
            <div className="hidden md:block md:w-1/2 lg:w-1/2 mt-0 md:mr-4 lg:mr-8">
              <div className="flex justify-end gap-4 lg:gap-8 items-stretch md:ml-4 lg:ml-6">
                {/* Card 1 - Consult Online */}
                <div className="flex flex-col gap-2 lg:gap-3 w-[200px] lg:w-[285px]">
                  <div className="relative bg-transparent overflow-hidden h-[150px] lg:h-[230px]">
                    <Image
                      src="/hero-section1.svg"
                      alt="Consult Online"
                      width={290}
                      height={200}
                      className="object-contain"
                    />
                  </div>
                  <div className="bg-white rounded-[14px] lg:rounded-[20px] p-2.5 lg:p-6 flex flex-col gap-1 lg:gap-2 flex-1">
                    <div className="flex items-center justify-between gap-2 lg:gap-3">
                      <p className="font-semibold text-[#333333] text-sm lg:text-[15px] leading-tight">
                        Consult Online Now
                      </p>
                      <button
                        onClick={() => setIsConsultModalOpen(true)}
                        className="btn-wipe-up w-8 h-8 lg:w-11 lg:h-11 bg-[#4E148C] rounded-lg flex items-center justify-center flex-shrink-0 aspect-square"
                      >
                        <ArrowRight className="w-3 h-3 lg:w-5 lg:h-5 text-white -rotate-45 relative z-10" />
                      </button>
                    </div>
                    <p className="text-[10px] lg:text-[13px] text-gray-500 leading-relaxed hidden lg:block">
                      Instantly connect with Specialists through Video call.
                    </p>
                  </div>
                </div>

                {/* Card 2 - In Clinic */}
                <div className="w-[160px] lg:w-[285px] mr-1 lg:mr-2 relative flex flex-col">
                  <div className="relative rounded-[14px] lg:rounded-[20px] overflow-hidden shadow-lg flex-1 min-h-[220px] lg:min-h-[340px]">
                    <Image
                      src="/hero-section2.svg"
                      alt="In Clinic Appointment"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-2 lg:bottom-3 left-2 lg:left-3 right-2 lg:right-3">
                      <button
                        onClick={() => setIsInClinicModalOpen(true)}
                        className="btn-wipe-up w-full bg-[#4E148C] text-white py-2.5 lg:py-3 px-3 lg:px-6 rounded-full flex items-center justify-between text-sm lg:text-base font-normal shadow-lg"
                      >
                        <div className="flex items-center gap-1.5 lg:gap-2.5 relative z-10">
                          <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-white" />
                          In Clinic Appointment
                        </div>
                        <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4 -rotate-45 relative z-10" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Image Cards - OUTSIDE gray container */}
      <div className="md:hidden mt-6 px-2">
        <div className="flex justify-center gap-3 items-stretch">
          {/* Card 1 - Consult Online */}
          <div className="flex flex-col gap-2 flex-1 max-w-[200px]">
            <div className="relative rounded-[16px] overflow-hidden h-full min-h-[220px] shadow-md">
              <Image
                src="/hero-section1.svg"
                alt="Consult Online"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex items-center justify-between gap-2 py-2">
              <p className="font-normal text-[#333333] text-[11px] sm:text-sm leading-tight">
                Consult Online Now
              </p>
              <button
                onClick={() => setIsConsultModalOpen(true)}
                className="btn-wipe-up w-8 h-8 bg-[#4E148C] rounded-full flex items-center justify-center flex-shrink-0"
              >
                <ArrowRight className="w-3 h-3 text-white -rotate-45 relative z-10" />
              </button>
            </div>
          </div>

          {/* Card 2 - In Clinic */}
          <div className="flex flex-col gap-2 flex-1 max-w-[200px]">
            <div className="relative rounded-[16px] overflow-hidden h-full min-h-[280px] shadow-md">
              <Image
                src="/hero-section2.svg"
                alt="In Clinic Appointment"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-3 left-2 right-2">
                <button
                  onClick={() => setIsInClinicModalOpen(true)}
                  className="btn-wipe-up w-full bg-[#4E148C] text-white py-2 sm:py-3.5 px-2 sm:px-4 rounded-full flex items-center justify-between text-[10px] sm:text-sm font-normal shadow-lg"
                >
                  <div className="flex items-center gap-1 sm:gap-2 relative z-10">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white" />
                    In Clinic Appointment
                  </div>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 -rotate-45 relative z-10" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isConsultModalOpen} onOpenChange={setIsConsultModalOpen}>
        <DialogContent showCloseButton={false} className="max-w-[95vw] sm:max-w-[90vw] md:max-w-2xl lg:max-w-3xl max-h-[92vh] overflow-y-auto bg-white rounded-[48px] border-none shadow-lg">
          <ConsultOnline />
        </DialogContent>
      </Dialog>

      <Dialog open={isInClinicModalOpen} onOpenChange={setIsInClinicModalOpen}>
        <DialogContent showCloseButton={false} className="bg-transparent border-none shadow-none max-w-[95vw] sm:max-w-[90vw] md:max-w-2xl lg:max-w-3xl p-0 outline-none">
          <div className="bg-white rounded-[32px] p-6 lg:p-8 w-full max-h-[92vh] overflow-y-auto">
            <InClinicAppointment />
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}