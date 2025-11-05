"use client";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import {
  Command,
  CommandInput,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";
import { SchoolSelectType } from "../../../lib/db/schema";

interface SearchBelowHeroProps {
  schools?: SchoolSelectType[];
}

export default function SearchBarSchool({ schools }: SearchBelowHeroProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions from backend with debouncing
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const res = await fetch(`/api/places?input=${encodeURIComponent(query)}`);
        const data = await res.json();
        
        if (data.predictions) {
          const filtered = data.predictions.filter((p: any) =>
            /(school|college|university|institute)/i.test(p.description)
          );
          setSuggestions(filtered);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error("Error fetching suggestions:", err);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the API call
    const timeoutId = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Debug effect - separate from the fetch effect
  useEffect(() => {
    console.log("Current suggestions:", suggestions);
  }, [suggestions]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Function to fetch lat/lng of selected school
  const handleSelect = async (place_id: string, description: string) => {
    setQuery(description);
    setIsFocused(false);

    try {
      const res = await fetch(`/api/place-details?place_id=${place_id}`);
      const data = await res.json();
      if (data.result?.geometry?.location) {
        const { lat, lng } = data.result.geometry.location;
        router.push(`/school?lat=${lat}&lon=${lng}&description=${query}`);
      } else {
        console.log("No location found for this place.");
      }
    } catch (err) {
      console.error("Error fetching place details:", err);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8 }}
      ref={wrapperRef}
      className="w-full max-w-5xl mt-8 mx-auto sm:px-0 px-3"
    >
      <div className="relative sm:w-1/2 mx-auto my-4">
        <Command className="flex-1 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 focus-within:border-emerald-300 bg-white">
          <CommandInput
            onFocus={() => setIsFocused(true)}
            value={query}
            onValueChange={(value) => setQuery(value)}
            placeholder="Search for schools..."
            className="bg-transparent !h-[50px] outline-none text-sm md:text-base py-4"
          />
        </Command>

        {/* Custom Dropdown */}
        {isFocused && (
          <div className="absolute z-50 top-full mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-auto">
            {isLoading ? (
              <div className="px-4 py-3 text-sm text-gray-500">
                Loading...
              </div>
            ) : suggestions.length > 0 ? (
              <div className="py-1">
                {suggestions.map((s) => (
                  <div
                    key={s.place_id}
                    onClick={() => handleSelect(s.place_id, s.description)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-all duration-200"
                  >
                    {/* Placeholder image */}
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-lg">
                      🏫
                    </div>

                    {/* School Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {s.description}
                      </p>
                      {s.structured_formatting?.secondary_text && (
                        <p className="text-xs text-gray-400 truncate">
                          {s.structured_formatting.secondary_text}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : query.length >= 2 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No results — try something else!
              </div>
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                Type at least 2 characters...
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}