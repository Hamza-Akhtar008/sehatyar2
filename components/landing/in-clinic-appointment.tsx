"use client";

import { Search, MapPin, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
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

export default function InClinicAppointment() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isLocationFocused, setIsLocationFocused] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // Use global location context
  const { 
    city: location, 
    setCity: setLocation, 
    isLoadingLocation, 
    citySuggestions, 
    getCitySuggestions, 
    clearCitySuggestions 
  } = useLocation();

  // Handle location input change with autocomplete (uses global context)
  const handleLocationInputChange = useCallback((value: string) => {
    setLocation(value);
    getCitySuggestions(value);
  }, [setLocation, getCitySuggestions]);

  // Filter specializations based on user input
  const filteredSpecializations = useMemo(() => {
    if (!search.trim()) return specializations;
    return specializations.filter((spec) =>
      spec.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const handleSearch = () => {
    // Only navigate if both fields have values
    if (!location.trim() || !search.trim()) {
      return;
    }
    
    router.push(
      `/doctor?query=${encodeURIComponent(search)}&city=${encodeURIComponent(
        location
      )}`
    );
  };

  const handleLocationClick = (suggestion: string) => {
    // Extract just the city name from the full suggestion (e.g., "Lahore, Pakistan" -> "Lahore")
    const cityName = suggestion.split(",")[0];
    setLocation(cityName);
    clearCitySuggestions();
    setIsLocationFocused(false);
    
    // Only navigate if search field also has a value
    if (search.trim()) {
      router.push(
        `/doctor?query=${encodeURIComponent(search)}&city=${encodeURIComponent(
          cityName
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
          {isLoadingLocation ? (
            <Loader2 className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 sm:w-6 sm:h-6 z-10 animate-spin" />
          ) : (
            <MapPin className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 sm:w-6 sm:h-6 z-10" />
          )}
          <Input 
            placeholder={isLoadingLocation ? "Detecting location..." : "Enter city name"}
            value={location}
            onChange={(e) => handleLocationInputChange(e.target.value)}
            onFocus={() => setIsLocationFocused(true)}
            onBlur={() => {
              // Delay to allow click on suggestions
              setTimeout(() => setIsLocationFocused(false), 200);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
                setIsLocationFocused(false);
              }
            }}
            className="pl-10 sm:pl-14 bg-[#F4F4F4] border border-[#F4F4F4] rounded-full h-[50px] sm:h-[60px] text-base sm:text-lg text-[#333333] shadow-none focus-visible:ring-0 placeholder:text-gray-500"
          />
        </div>
        <Button 
          onClick={handleSearch}
          disabled={!location.trim() || !search.trim()}
          className="bg-[#4E148C] hover:bg-[#3b0f6b] text-white rounded-full px-6 sm:px-10 h-[50px] sm:h-[60px] text-base sm:text-lg font-medium shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Find
        </Button>
      </div>

      {/* General Search Row */}
      <div className="relative w-full">
        <Search className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 sm:w-6 sm:h-6 z-10" />
        <Input 
          placeholder="Search for doctors, hospital, specialist, services, diseases" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => {
            // Delay to allow click on suggestions
            setTimeout(() => setIsSearchFocused(false), 200);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
              setIsSearchFocused(false);
            }
          }}
          className="pl-10 sm:pl-14 bg-[#F4F4F4] border border-[#F4F4F4] rounded-full h-[50px] sm:h-[60px] text-base sm:text-lg text-[#333333] shadow-none focus-visible:ring-0 placeholder:text-gray-500 placeholder:text-sm sm:placeholder:text-base"
        />
      </div>

      {/* Suggestions Container with max-height and scroll */}
      <div className="max-h-[400px] sm:max-h-[500px] overflow-y-auto flex flex-col gap-2 sm:gap-3">
        {/* Show current location value when focused and typing */}
        {isLocationFocused && location.trim() && citySuggestions.length === 0 && (
          <div className="flex items-center gap-3 sm:gap-4 w-full px-4 sm:px-6 h-[50px] sm:h-[60px] bg-white border border-gray-200 rounded-full">
            <MapPin className="text-gray-500 w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
            <span className="text-gray-600 text-base sm:text-lg font-medium truncate">{location}</span>
          </div>
        )}

        {/* Show current search value when focused and typing */}
        {isSearchFocused && search.trim() && (
          <div className="flex items-center gap-3 sm:gap-4 w-full px-4 sm:px-6 h-[50px] sm:h-[60px] bg-white border border-gray-200 rounded-full">
            <Search className="text-gray-500 w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
            <span className="text-gray-600 text-base sm:text-lg font-medium truncate">{search}</span>
          </div>
        )}

        {/* Location Dropdown Suggestions from Google Places */}
        {isLocationFocused && citySuggestions.length > 0 && (
          <>
            {citySuggestions.map((suggestion) => (
              <button 
                key={suggestion} 
                onClick={() => handleLocationClick(suggestion)}
                className="flex items-center gap-3 sm:gap-4 w-full px-4 sm:px-6 h-[50px] sm:h-[60px] bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors text-left group"
              >
                <MapPin className="text-gray-500 w-5 h-5 sm:w-6 sm:h-6 group-hover:text-gray-700 flex-shrink-0" />
                <span className="text-gray-600 text-base sm:text-lg font-medium group-hover:text-gray-900 truncate">{suggestion}</span>
              </button>
            ))}
          </>
        )}

        {/* Specialization Dropdown Suggestions */}
        {isSearchFocused && search.trim() && filteredSpecializations.length > 0 && (
          <>
            {filteredSpecializations.map((spec) => (
              <button 
                key={spec} 
                onClick={() => handleSpecializationClick(spec)}
                className="flex items-center gap-3 sm:gap-4 w-full px-4 sm:px-6 h-[50px] sm:h-[60px] bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors text-left group"
              >
                <Search className="text-gray-500 w-5 h-5 sm:w-6 sm:h-6 group-hover:text-gray-700 flex-shrink-0" />
                <span className="text-gray-600 text-base sm:text-lg font-medium group-hover:text-gray-900 truncate">{spec}</span>
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
