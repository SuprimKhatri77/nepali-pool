"use client";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { Command, CommandInput } from "@/components/ui/command";
import { useRouter } from "next/navigation";
import { SchoolSelectType } from "../../../lib/db/schema";
import Image from "next/image";

export default function SearchBarSchool({
  schools,
}: {
  schools: SchoolSelectType[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  //  Filter schools from query
  const filteredSchools =
  query.trim().length < 1
    ? []
    : schools.filter((s) =>
        (s.name?.toLowerCase().includes(query.toLowerCase()) || 
         s.address?.toLowerCase().includes(query.toLowerCase()) || 
         s.city?.toLowerCase().includes(query.toLowerCase()))
      );

  // Close dropdown when clicked outside
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectLocal = (school: SchoolSelectType) => {
    setQuery(school.name ?? "");
    setIsFocused(false);

    
     router.push(`/schools/${school.id}`);
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

        {/* Dropdown */}
        {isFocused && (
          <div className="absolute z-50 top-full mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-auto">
            {filteredSchools.length > 0 ? (
              <div className="py-1">
                {filteredSchools.map((school) => (
                  <div
                    key={school.id}
                    onClick={() => handleSelectLocal(school)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-all duration-200"
                  >
                    {/* School Initial (Icon Placeholder) */}
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-lg font-semibold text-emerald-700">
                      <Image src={school.imageUrl ?? ""} width={16} height={16} alt={school.name + "Image"} />
                    </div>

                    {/* School Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {school.name}
                      </p>
                      {school.address && (
                        <p className="text-xs text-gray-400 truncate">
                          {school.address}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : query.length >= 1 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No schools found
              </div>
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                Type to search schools...
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
