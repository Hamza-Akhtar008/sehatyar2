"use client";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Image from "next/image";
import { ArrowRight, Search, MapPin, Loader2 } from "lucide-react";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
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
    isLoadingLocation, 
    citySuggestions, 
    getCitySuggestions, 
    clearCitySuggestions 
  } = useLocation();
  
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [isInClinicModalOpen, setIsInClinicModalOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
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
      <div className="relative bg-[#F4F4F4] rounded-[32px] md:rounded-[42px] overflow-hidden min-h-[350px] md:min-h-[380px] lg:min-h-[407px] flex items-center">
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
            <div className="w-full md:w-1/2 md:ml-6 lg:ml-10 md:mt-2 lg:mt-3 px-6 py-8 md:py-0">
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
                  {isLoadingLocation ? (
                    <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                  ) : (
                    <MapPin className="w-4 h-4 text-gray-500" />
                  )}
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => handleCityInputChange(e.target.value)}
                      onFocus={() => setIsCityFocused(true)}
                      onKeyDown={handleCityKeyDown}
                      placeholder={isLoadingLocation ? "Detecting location..." : "Select City"}
                      className="bg-transparent border-none outline-none text-gray-700 text-base font-medium cursor-pointer p-0 h-auto focus-visible:outline-none w-full"
                    />
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
                <div className="bg-white p-4 rounded-[22px] shadow-lg border border-gray-200 flex items-center gap-2">
                  <div className="flex-1 bg-[#F5F5F5] rounded-[22px] px-4 py-4  flex items-center gap-2">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Doctors, Hospital, Specialties"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="border-none bg-transparent p-0 h-auto focus-visible:outline-none placeholder:text-gray-400 text-gray-700 text-sm w-full"
                    />
                  </div>
                  <Button
                    onClick={handleSearch}
                    className="bg-[#4E148C] hover:bg-[#ff781e] text-white rounded-[22px] px-5 py-4 h-auto text-sm font-medium transition-colors"
                  >
                    Search
                  </Button>
                </div>
              </div>

              {/* Desktop Search Bar */}
              <div
                className="hidden md:flex bg-white p-2 shadow-lg max-w-[1000px] border rounded-full border-gray-100 flex-row gap-2 mt-4"
                ref={dropdownRef}
              >
                <div className="flex-1 relative bg-[#F4F4F4] rounded-full px-6 py-2 flex items-center gap-3">
                  <Search className="w-5 h-5 text-gray-400" />
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Specialist or Hospital"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onKeyDown={handleKeyDown}
                      className="border-none bg-transparent p-0 h-auto focus-visible:outline-none placeholder:text-gray-400 text-gray-700 text-base w-full"
                    />
                    {isFocused && filtered.length > 0 && (
                      <div className="absolute top-full left-0 mt-4 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto ">
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
                    )}
                  </div>
                </div>

                <div className="flex-1 bg-[#F4F4F4] rounded-full px-6 py-2 flex items-center gap-3 relative" ref={cityDropdownRef}>
                  <div className="w-5 h-5 flex items-center justify-center">
                    {isLoadingLocation ? (
                      <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                    ) : (
                      <MapPin className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => handleCityInputChange(e.target.value)}
                      onFocus={() => setIsCityFocused(true)}
                      onKeyDown={handleCityKeyDown}
                      placeholder={isLoadingLocation ? "Detecting location..." : "Near you or Enter City"}
                      className="border-none bg-transparent p-0 h-auto focus-visible:outline-none placeholder:text-gray-400 text-gray-700 text-base w-full"
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
                            <MapPin className={`w-4 h-4 ${index === cityFocusedIndex ? "text-white" : "text-gray-400"}`} />
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleSearch}
                  className="bg-[#4E148C] hover:bg-[#ff781e] text-white rounded-full px-6 py-4 h-auto text-base font-medium transition-colors"
                >
                  Search
                </Button>
              </div>
            </div>

            {/* Desktop Right Content - Images (inside gray container) */}
            <div className="hidden md:block md:w-1/2 lg:w-1/2 mt-0">
              <div className="flex justify-end gap-2 lg:gap-3 items-start md:ml-4 lg:ml-10">
                {/* Card 1 - Consult Online */}
                <div className="flex flex-col gap-2 lg:gap-3 w-[180px] lg:w-[260px]">
                  <div className="relative bg-transparent overflow-hidden h-[130px] lg:h-[200px]">
                    <Image
                      src="/hero-section1.svg"
                      alt="Consult Online"
                      width={290}
                      height={200}
                      className="object-contain"
                    />
                  </div>
                  <div className="bg-white rounded-[14px] lg:rounded-[20px] p-2.5 lg:p-4 flex flex-col gap-1 lg:gap-2">
                    <div className="flex items-center justify-between gap-2 lg:gap-3">
                      <h3 className="font-bold text-[#333333] text-xs lg:text-base leading-tight">
                        Consult Online Now
                      </h3>
                      <button
                        onClick={() => setIsConsultModalOpen(true)}
                        className="w-6 h-6 lg:w-9 lg:h-9 bg-[#4E148C] rounded-[10px] lg:rounded-[16.43px] flex items-center justify-center flex-shrink-0 hover:bg-[#ff781e] transition-colors"
                      >
                        <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4 text-white -rotate-45" />
                      </button>
                    </div>
                    <p className="text-[9px] lg:text-[11px] text-gray-500 leading-relaxed hidden lg:block">
                      Instantly connect with Specialists through Video call.
                    </p>
                  </div>
                </div>

                {/* Card 2 - In Clinic */}
                <div className="w-[140px] lg:w-[250px] mr-1 lg:mr-2 relative">
                  <div className="relative rounded-[14px] lg:rounded-[20px] overflow-hidden h-[200px] lg:h-[300px] shadow-lg">
                    <Image
                      src="/hero-section2.svg"
                      alt="In Clinic Appointment"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-2 lg:bottom-3 left-2 lg:left-3 right-2 lg:right-3">
                      <button 

                       onClick={() => setIsInClinicModalOpen(true)}
                        className="w-full bg-[#4E148C] text-white py-1.5 lg:py-2.5 px-2 lg:px-3 rounded-full flex items-center justify-between text-[9px] lg:text-xs font-medium hover:bg-[#ff781e] transition-colors shadow-lg"
                      >
                        <div className="flex items-center gap-1 lg:gap-2">
                          <div
                           
                            className="w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full bg-white" />
                          In Clinic Appointment
                        </div>
                        <ArrowRight className="w-2.5 h-2.5 lg:w-3.5 lg:h-3.5 -rotate-45" />
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
        <div className="flex justify-center gap-3 items-start">
          {/* Card 1 - Consult Online */}
          <div className="flex flex-col gap-2 flex-1 max-w-[180px]">
            <div className="relative rounded-[16px] overflow-hidden h-[200px] shadow-md">
              <Image
                src="/hero-section1.svg"
                alt="Consult Online"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex items-center justify-between gap-2 py-2">
              <h3 className="font-bold text-[#333333] text-sm leading-tight">
                Consult Online Now
              </h3>
              <button
                onClick={() => setIsConsultModalOpen(true)}
                className="w-8 h-8 bg-[#4E148C] rounded-lg flex items-center justify-center flex-shrink-0 hover:bg-[#ff781e] transition-colors"
              >
                <ArrowRight className="w-3.5 h-3.5 text-white -rotate-45" />
              </button>
            </div>
          </div>

          {/* Card 2 - In Clinic */}
          <div className="flex-1 max-w-[180px]">
            <div className="relative rounded-[16px] overflow-hidden h-[260px] shadow-md">
              <Image
                src="/hero-section2.svg"
                alt="In Clinic Appointment"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-3 left-2 right-2">
                <button 
                  onClick={() => setIsInClinicModalOpen(true)}
                  className="w-full bg-[#4E148C] text-white py-2 px-2 rounded-full flex items-center justify-between text-[10px] font-medium hover:bg-[#ff781e] transition-colors shadow-lg"
                >
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    In Clinic Appointment
                  </div>
                  <ArrowRight className="w-3 h-3 -rotate-45" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isConsultModalOpen} onOpenChange={setIsConsultModalOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-3xl lg:max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-[32px] border-none  shadow-lg">
          <ConsultOnline />
        </DialogContent>
      </Dialog>

      <Dialog open={isInClinicModalOpen} onOpenChange={setIsInClinicModalOpen}>
        <DialogContent showCloseButton={false} className="bg-transparent border-none shadow-none max-w-[95vw] sm:max-w-[90vw] md:max-w-3xl lg:max-w-4xl p-0 outline-none">
          <div className="bg-white rounded-[32px] p-6 w-full max-h-[85vh] overflow-y-auto">
            <InClinicAppointment />
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}