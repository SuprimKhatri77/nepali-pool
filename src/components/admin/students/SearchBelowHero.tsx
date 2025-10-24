"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Sliders } from "lucide-react";
import Image from "next/image";
import { StudentProfileWithUser } from "../../../../types/all-types";



interface SearchBelowHeroProps {
  students: StudentProfileWithUser[];
  sendTo?: string
}

export default function SearchBarStudent({ students, sendTo = "/admin/students/" }: SearchBelowHeroProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null)

  // Filter students based on query
  const results = useMemo(() => {
    if (!query.trim()) return students.slice(0, 6);
    const q = query.toLowerCase();
    return students.filter(
      (m) => {
        if(m.city){
          return  m.user.name.toLowerCase().includes(q) || m.city.toLowerCase().includes(q)
        }
      }
    );
  }, [query, students]);

  

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
    <div ref={wrapperRef} className="w-full max-w-5xl  mt-8 ">
     <div className="max-w-[900px] mx-auto flex flex-wrap items-center gap-3 justify-center">
       {/* Search Bar */}
      <Command className="flex-1 min-w-[250px] border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 focus-within:border-emerald-300 bg-white">
        <div className="flex items-center gap-2 px-3 py-2 w-full">
          <CommandInput
           onFocus={() => setIsFocused(true)}
            value={query}
            onValueChange={(value)=> setQuery(value)}
            placeholder="Search for students..."
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
            isFocused ?  <CommandList className="absolute z-50 mt-12 sm:w-1/2 bg-white border border-gray-200 rounded-md shadow-lg max-h-64">
          {results.length === 0 ? (
            <CommandEmpty className="px-4 py-3 text-sm text-gray-500">
              No results — try &quot;Suprim&quot;, &quot;Roshan&quot;, or a real name
            </CommandEmpty>
          ) : (
           <CommandGroup>
  {results.map((m) => (
    <CommandItem
      key={m.userId}
      onSelect={() => {
        router.push(`${sendTo}${m.userId}`);
        setIsFocused(false);
      }}
      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-all duration-200"
    >
      {/* Profile Image */}
      <Image
        src={m.imageUrl || m.user?.image || ""}
        alt={m.user?.name || "mentor"}
        width={30}
        height={30}
        className="w-10 h-10 rounded-full object-cover border border-gray-200"
      />

      {/* Mentor Info */}
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-800">{m.user?.name}</p>
        
        <p className="text-xs text-gray-400 line-clamp-1">{m.bio}</p>
      </div>

      {/* Optional Badge or Tag */}
      <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded-lg">
        {m.city}, {m.district}
      </span>
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
