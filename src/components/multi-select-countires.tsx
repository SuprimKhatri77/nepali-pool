"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { X, ChevronDown, Search } from "lucide-react";
import { cn } from "@/components/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MultiSelectCountriesProps {
  countries: string[];
  selectedCountries: string[];
  onSelectionChange: (countries: string[]) => void;
  placeholder?: string;
  className?: string;
}

export default function MultiSelectCountries({
  countries,
  selectedCountries,
  onSelectionChange,
  placeholder = "Search and select countries...",
  className,
}: MultiSelectCountriesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredCountries = countries.filter(
    (country) =>
      country.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedCountries.includes(country)
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCountrySelect = (country: string) => {
    onSelectionChange([...selectedCountries, country]);
    setSearchTerm("");
    inputRef.current?.focus();
  };

  const handleCountryRemove = (countryToRemove: string) => {
    onSelectionChange(
      selectedCountries.filter((country) => country !== countryToRemove)
    );
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      {selectedCountries.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3 p-3 bg-muted/50 rounded-md">
          {selectedCountries.map((country) => (
            <Badge
              key={country}
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1"
            >
              {country}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => handleCountryRemove(country)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {country}</span>
              </Button>
            </Badge>
          ))}
        </div>
      )}

      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            className="pl-10 pr-10"
          />
          <ChevronDown
            className={cn(
              "absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md max-h-60 overflow-auto">
            {filteredCountries.length > 0 ? (
              <div className="py-1">
                {filteredCountries.map((country) => (
                  <button
                    key={country}
                    type="button"
                    className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                    onClick={() => handleCountrySelect(country)}
                  >
                    {country}
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                {searchTerm
                  ? "No countries found"
                  : "Start typing to search countries"}
              </div>
            )}
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-2">
        {selectedCountries.length === 0
          ? "Search and click to add countries to your favorites"
          : `${selectedCountries.length} destination${selectedCountries.length === 1 ? "" : "s"} selected`}
      </p>
    </div>
  );
}
