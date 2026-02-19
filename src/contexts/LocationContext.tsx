"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

// Define types for Google Maps API
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
  }
}

type LocationContextType = {
  city: string;
  setCity: (city: string) => void;
  isLoadingLocation: boolean;
  googleMapsLoaded: boolean;
  citySuggestions: string[];
  getCitySuggestions: (input: string) => void;
  clearCitySuggestions: () => void;
};

const LocationContext = createContext<LocationContextType>({
  city: "",
  setCity: () => {},
  isLoadingLocation: false,
  googleMapsLoaded: false,
  citySuggestions: [],
  getCitySuggestions: () => {},
  clearCitySuggestions: () => {},
});

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [city, setCity] = useState<string>("");
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState<boolean>(false);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const autocompleteServiceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const geocoderRef = useRef<any>(null);

  // Set mounted state on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load Google Maps Script (only on client)
  useEffect(() => {
    if (!isMounted) return;
    
    if (typeof window !== 'undefined' && window.google?.maps?.places) {
      setGoogleMapsLoaded(true);
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
    if (existingScript) {
      existingScript.addEventListener('load', () => setGoogleMapsLoaded(true));
      // If script already loaded but state not set
      if (typeof window !== 'undefined' && window.google?.maps?.places) {
        setGoogleMapsLoaded(true);
      }
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setGoogleMapsLoaded(true);
    };
    document.head.appendChild(script);
  }, [isMounted]);

  // Initialize autocomplete service and geocoder when Google Maps is loaded
  useEffect(() => {
    if (googleMapsLoaded && window.google) {
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
      geocoderRef.current = new window.google.maps.Geocoder();
    }
  }, [googleMapsLoaded]);

  // AUTO-DETECT LOCATION DISABLED
  // Get user's current location on mount
  // useEffect(() => {
  //   if (!googleMapsLoaded || !geocoderRef.current || city) return;
  //
  //   const getCurrentCity = () => {
  //     setIsLoadingLocation(true);
  //
  //     if (navigator.geolocation) {
  //       navigator.geolocation.getCurrentPosition(
  //         (position) => {
  //           const { latitude, longitude } = position.coords;
  //
  //           geocoderRef.current.geocode(
  //             { location: { lat: latitude, lng: longitude } },
  //             // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //             (results: any[], status: string) => {
  //               setIsLoadingLocation(false);
  //               if (status === "OK" && results[0]) {
  //                 // Find city from address components
  //                 const addressComponents = results[0].address_components;
  //                 let cityName = "";
  //
  //                 // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //                 for (const component of addressComponents) {
  //                   if (component.types.includes("locality")) {
  //                     cityName = component.long_name;
  //                     break;
  //                   }
  //                   if (component.types.includes("administrative_area_level_2")) {
  //                     cityName = component.long_name;
  //                   }
  //                   if (!cityName && component.types.includes("administrative_area_level_1")) {
  //                     cityName = component.long_name;
  //                   }
  //                 }
  //
  //                 if (cityName) {
  //                   setCity(cityName);
  //                 }
  //               }
  //             }
  //           );
  //         },
  //         (error) => {
  //           setIsLoadingLocation(false);
  //           console.log("Geolocation error:", error.message);
  //         },
  //         { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
  //       );
  //     } else {
  //       setIsLoadingLocation(false);
  //     }
  //   };
  //
  //   getCurrentCity();
  // }, [googleMapsLoaded, city]);

  // Get city suggestions from Google Places
  const getCitySuggestions = useCallback((input: string) => {
    if (!input.trim() || !autocompleteServiceRef.current) {
      setCitySuggestions([]);
      return;
    }

    autocompleteServiceRef.current.getPlacePredictions(
      {
        input,
        types: ["(cities)"],
        componentRestrictions: { country: "pk" }, // Restrict to Pakistan
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (predictions: any[] | null, status: string) => {
        if (status === "OK" && predictions) {
          const cities = predictions.map((p) => p.description);
          setCitySuggestions(cities);
        } else {
          setCitySuggestions([]);
        }
      }
    );
  }, []);

  const clearCitySuggestions = useCallback(() => {
    setCitySuggestions([]);
  }, []);

  const value = {
    city,
    setCity,
    isLoadingLocation,
    googleMapsLoaded,
    citySuggestions,
    getCitySuggestions,
    clearCitySuggestions,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

// Custom hook to use the location context
export const useLocation = () => useContext(LocationContext);
