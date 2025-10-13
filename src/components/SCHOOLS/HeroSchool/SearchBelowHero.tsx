"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import {  Sliders } from "lucide-react";
import { useRouter } from "next/navigation";
import { SchoolSelectType } from "../../../../lib/db/schema";



interface SearchBelowHeroProps {
  schools: SchoolSelectType[];
}

export default function SearchBelowHero({ schools }: SearchBelowHeroProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null)

  // Filter schools based on query
  const results = useMemo(() => {
    if (!query.trim()) return schools.slice(0, 6);
    const q = query.toLowerCase();
    return schools.filter(
      (s) => {

        if(s.name && s.city){

         return s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q)
        }
      }
    );
  }, [query, schools]);

  

  const filters = ["Country", "City", "Price", "Top Rated"];

   // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="w-full max-w-5xl mx-auto mt-8 ">
     <div className="max-w-[900px] flex flex-wrap items-center gap-3 justify-center">
       {/* Search Bar */}
      <Command className="flex-1 min-w-[250px] border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 focus-within:border-emerald-300 bg-white">
        <div className="flex items-center gap-2 px-3 py-2 w-full">
          <CommandInput
           onFocus={() => setIsFocused(true)}
            value={query}
            onValueChange={(value)=> setQuery(value)}
            placeholder="Search for schools..."
            className="bg-transparent outline-none text-sm md:text-base flex-1"
          />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-lg hover:bg-gray-100"
          >
            <Sliders className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
 
        {/* Results dropdown */}
        {
            isFocused ?  <CommandList className="absolute z-50 mt-12 w-1/2 bg-white border border-gray-200 rounded-md shadow-lg max-h-64">
          {results.length === 0 ? (
            <CommandEmpty className="px-4 py-3 text-sm text-gray-500">
              No results — try &quot;Tokyo&quot;, &quot;Osaka&quot;, or a school name
            </CommandEmpty>
          ) : (
            <CommandGroup >
              {results.map((s) => (
                <CommandItem
                  key={s.id}
                  onSelect={()  => {router.push(`/schools/${s.id}`); setIsFocused(false)}}
                  className="flex justify-between items-center px-4 py-3 hover:bg-gray-50 cursor-pointer"
                >
                  <span className="text-sm text-gray-800">{s.name}</span>
                  <CommandShortcut className="text-xs text-gray-500">
                    {s.city}
                  </CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList> : ""
        }
       
      </Command>

      {/* Inline Filter Buttons */}
      {filters.map((f) => (
        <Button
          key={f}
          variant="outline"
          className="min-w-[100px] sm:min-w-[120px] py-2 border-gray-300 text-gray-800 hover:border-emerald-400 hover:text-emerald-600 transition-all duration-300"
        >
          {f}
        </Button>
      ))}
     </div>
    </div>
  );
}
