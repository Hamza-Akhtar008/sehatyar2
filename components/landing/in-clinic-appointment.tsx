"use client";

import { Search, MapPin, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

// Hardcoded cities for suggestions
const CITIES = ["Abbottabad", "Haripur", "Manshera", "Battagram"];

// Popular specializations shown by default (when search is empty)
const POPULAR_SPECIALIZATIONS = [
  "Cardiology",
  "Dermatology",
  "Pediatrics",
  "Neurology",
  "General Surgery",
];

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

export default function InClinicAppointment() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [isLocationFocused, setIsLocationFocused] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const citySuggestions = useMemo(() => {
    if (!location.trim()) return CITIES;
    return CITIES.filter((c) =>
      c.toLowerCase().includes(location.toLowerCase())
    ).slice(0, 5);
  }, [location]);
  const filteredSpecializations = useMemo(() => {
    if (!search.trim()) return POPULAR_SPECIALIZATIONS;
    return specializations
      .filter((spec) => spec.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 5);
  }, [search]);

  const handleSearch = () => {
    // Only navigate if both fields have values
    if (!location.trim() || !search.trim()) {
      return;
    }
    setIsLoading(true);
    router.push(
      `/doctor?query=${encodeURIComponent(search)}&city=${encodeURIComponent(
        location
      )}`
    );
  };

  const handleLocationClick = (city: string) => {
    setLocation(city);
    setIsLocationFocused(false);

    // Only navigate if search field also has a value
    if (search.trim()) {
      setIsLoading(true);
      router.push(
        `/doctor?query=${encodeURIComponent(search)}&city=${encodeURIComponent(
          city
        )}`
      );
    }
  };

  const handleSpecializationClick = (spec: string) => {
    setSearch(spec);
    setIsSearchFocused(false);
  };

  return (
    <div className="w-full flex flex-col gap-3 sm:gap-4">
      {/* Location Search Row */}
      <div className="flex gap-2 sm:gap-3 w-full">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5 z-10" />
          <Input
            placeholder="Enter city name"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onFocus={() => setIsLocationFocused(true)}
            onBlur={() => {
              // 300ms delay – onMouseDown on suggestions fires before onBlur
              setTimeout(() => setIsLocationFocused(false), 300);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
                setIsLocationFocused(false);
              }
            }}
            className="pl-9 sm:pl-11 bg-[#F4F4F4] border-0 rounded-full h-[48px] sm:h-[56px] text-sm sm:text-base text-[#333333] shadow-none focus-visible:ring-2 focus-visible:ring-[#4e148c] focus-visible:ring-offset-0 placeholder:text-gray-500"
          />
        </div>
        <Button
          onClick={handleSearch}
          disabled={!location.trim() || !search.trim() || isLoading}
          className="btn-wipe-up bg-[#4E148C] text-white rounded-full px-5 sm:px-8 h-[48px] sm:h-[56px] text-sm sm:text-base font-medium shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isLoading ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              "Find"
            )}
          </span>
        </Button>
      </div>

      {/* General Search Row */}
      <div className="relative w-full">
        <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5 z-10" />
        <Input
          placeholder="Search for doctors, hospital, specialist, services, diseases"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => {
            // 300ms delay – onMouseDown on suggestions fires before onBlur
            setTimeout(() => setIsSearchFocused(false), 300);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
              setIsSearchFocused(false);
            }
          }}
          className="pl-9 sm:pl-11 bg-[#F4F4F4] border-0 rounded-full h-[48px] sm:h-[56px] text-sm sm:text-base text-[#333333] shadow-none focus-visible:ring-2 focus-visible:ring-[#4e148c] focus-visible:ring-offset-0 placeholder:text-gray-500 placeholder:text-xs sm:placeholder:text-sm"
        />
      </div>

      {/* Suggestions Container */}
      <div className="max-h-[400px] sm:max-h-[500px] overflow-y-auto flex flex-col gap-2 sm:gap-3">

        {/* City Suggestions (shown on focus – default all 4, filtered on type) */}
        {isLocationFocused && citySuggestions.length > 0 && (
          <>
            {citySuggestions.map((city) => (
              <button
                key={city}
                onMouseDown={() => handleLocationClick(city)}
                className="flex items-center gap-2 sm:gap-3 w-full px-3 sm:px-5 h-[44px] sm:h-[50px] bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors text-left group"
              >
                <MapPin className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5 group-hover:text-gray-700 flex-shrink-0" />
                <span className="text-gray-600 text-sm sm:text-base font-medium group-hover:text-gray-900 truncate">
                  {city}
                </span>
              </button>
            ))}
          </>
        )}

        {/* Specialization Suggestions (popular 5 on focus, filtered on type – max 5) */}
        {isSearchFocused && filteredSpecializations.length > 0 && (
          <>
            {filteredSpecializations.map((spec) => (
              <button
                key={spec}
                onMouseDown={() => handleSpecializationClick(spec)}
                className="flex items-center gap-2 sm:gap-3 w-full px-3 sm:px-5 h-[44px] sm:h-[50px] bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors text-left group"
              >
                <Search className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5 group-hover:text-gray-700 flex-shrink-0" />
                <span className="text-gray-600 text-sm sm:text-base font-medium group-hover:text-gray-900 truncate">
                  {spec}
                </span>
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
