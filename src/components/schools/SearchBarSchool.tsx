"use client";
import { motion } from "framer-motion";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { capitalizeFirstLetter } from "better-auth";
import { SchoolSelectType } from "../../../lib/db/schema";

interface SearchBelowHeroProps {
  schools: SchoolSelectType[];
}

export default function SearchBarSchool({ schools }: SearchBelowHeroProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Filter schools based on query
  const results = useMemo(() => {
    if (!query.trim()) return schools.slice(0, 6);
    const q = query.toLowerCase();
    return schools.filter((s) => {
      if (s.city && s.name) {
        return (
          s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q)
        );
      }
    });
  }, [query, schools]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8 }}
      ref={wrapperRef}
      className="w-full max-w-5xl  mt-8 mx-auto sm:px-0 px-3"
    >
      {/* Search Bar */}
      <Command className="flex-1  sm:px-0 sm:w-1/2 mx-auto my-4  border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 focus-within:border-emerald-300 bg-white">
        <CommandInput
          onFocus={() => setIsFocused(true)}
          value={query}
          onValueChange={(value) => setQuery(value)}
          placeholder="Search for schools..."
          className="bg-transparent !h-[50px] outline-none text-sm md:text-base  sm:w-1/2 py-4"
        />

        {/* Results dropdown */}
        {isFocused ? (
          <CommandList className="absolute z-50 mt-12 sm:w-1/2 bg-white border border-gray-200 rounded-md shadow-lg max-h-64">
            {results.length === 0 ? (
              <CommandEmpty className="px-4 py-3 text-sm text-gray-500">
                No results — try other!
              </CommandEmpty>
            ) : (
              <CommandGroup>
                {results.map((s) => (
                  <CommandItem
                    key={s.id}
                    onSelect={() => {
                      router.push(`/schools/${s.id}`);
                      setIsFocused(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-all duration-200"
                  >
                    {/* Profile Image */}
                    <Image
                      src={s.imageUrl ?? ""}
                      alt={s.name || "School"}
                      width={30}
                      height={30}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />

                    {/* Mentor Info */}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        {capitalizeFirstLetter(s.name ?? "")}
                      </p>

                      <p className="text-xs text-gray-400 line-clamp-1">
                        {capitalizeFirstLetter(s.websiteUrl ?? "")}
                      </p>
                    </div>

                    {/* Optional Badge or Tag */}
                    <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded-lg">
                      {capitalizeFirstLetter(s.city ?? "")}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        ) : (
          ""
        )}
      </Command>
    </motion.div>
  );
}
