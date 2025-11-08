// pages/scholarships.tsx
"use client"; // if using Next.js 13 app directory

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { motion } from "framer-motion";
import OurFeature from "@/components/whatweoffer/OurFeature";
const scholarshipWebsites = [
  {
    country: "UK",
    sites: [
      {
        name: "The Scholarship Hub",
        url: "https://www.thescholarshiphub.org.uk",
        description:
          "Database of UK university and private scholarships, grants, and bursaries.",
        imgUrl: "/ScholarshipSIteListing/thescholarshipshubdotcom.png",
      },
      {
        name: "Study UK – British Council",
        url: "https://study-uk.britishcouncil.org/scholarships-funding",
        description:
          "Official British Council portal listing UK government and university scholarships for international students.",
        imgUrl: "/ScholarshipSIteListing/studyukbritishcouncildotcom.png",
      },
    ],
  },
  {
    country: "Japan",
    sites: [
      {
        name: "Study in Japan (MEXT & JASSO)",
        url: "https://www.studyinjapan.go.jp/en/planning/scholarships/",
        description:
          "Official Japanese government resource listing MEXT and other scholarships for studying in Japan.",
        imgUrl: "/ScholarshipSIteListing/studyinjapandotcom.png",
      },
      {
        name: "JASSO Scholarship Search",
        url: "https://www.jasso.go.jp/en/search.html",
        description:
          "Search tool for Japanese government, private, and local scholarships for foreign students.",
        imgUrl: "/ScholarshipSIteListing/jassodotcom.png",
      },
    ],
  },
  {
    country: "USA",
    sites: [
      {
        name: "Scholarships.com",
        url: "https://www.scholarships.com",
        description:
          "Large database helping students find scholarships based on field, background, and eligibility.",
        imgUrl: "/ScholarshipSIteListing/scholarshipsdotcom.png",
      },
      {
        name: "Fastweb",
        url: "https://www.fastweb.com",
        description:
          "Scholarship-matching platform offering college funding opportunities and career advice.",
        imgUrl: "/ScholarshipSIteListing/fastwebdotcom.png",
      },
    ],
  },
  {
    country: "Australia",
    sites: [
      {
        name: "Study Australia – Scholarships Search",
        url: "https://search.studyaustralia.gov.au/scholarships",
        description:
          "Official Australian government site listing scholarships from universities and programs across the country.",
        imgUrl: "/ScholarshipSIteListing/studyaustraliagov.png",
      },
      {
        name: "Good Universities Guide",
        url: "https://www.gooduniversitiesguide.com.au/scholarships",
        description:
          "Lists thousands of scholarships from Australian universities and private organizations.",
        imgUrl: "/ScholarshipSIteListing/gooduniversitiesguidedotcom.png",
      },
    ],
  },
];

export default function Scholarships() {
  const [selectedCountry, setSelectedCountry] = useState("All");
  const router = useRouter();

  const filteredData =
    selectedCountry === "All"
      ? scholarshipWebsites
      : scholarshipWebsites.filter(
          (country) => country.country === selectedCountry
        );

  const countries = ["All", ...scholarshipWebsites.map((c) => c.country)];

  return (
    <div className="bg-white text-black min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-6 overflow-hidden bg-gradient-to-br from-emerald-100 to-emerald-300">
        {/* Decorative SVG shapes */}
        <div className="absolute top-0 left-0 w-full h-full">
          <svg
            className="absolute -top-20 -left-20 w-[600px] opacity-20"
            viewBox="0 0 600 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="300" cy="300" r="300" fill="white" />
          </svg>
          <svg
            className="absolute bottom-0 right-0 w-[500px] opacity-20"
            viewBox="0 0 500 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="250" cy="250" r="250" fill="white" />
          </svg>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-3xl">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold mb-6 text-black/80 drop-shadow-lg">
            Find Study Abroad{" "}
            <motion.span
              initial={{ width: "2ch" }}
              animate={{ width: "12ch" }}
              transition={{ duration: 3 }}
              className="overflow-hidden whitespace-nowrap inline-block"
            >
              Scholarships
            </motion.span>
          </h1>
          <p className="text-lg sm:text-2xl mb-8 text-emerald-800/90">
            Explore top scholarships from UK, Japan, USA, and Australia. Filter
            by country and connect with mentors for guidance.
          </p>
          <button
            onClick={() =>
              document
                .getElementById("scholarship-list")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-emerald-600 text-white font-semibold px-8 py-4 rounded-lg hover:bg-emerald-600 hover:scale-105 transition transform shadow-md"
          >
            Explore Scholarships
          </button>
        </div>
      </section>

      <div className="px-6 py-12 bg-emerald-100" id="scholarship-list">
        {/* Filter */}
        <div className="mb-8 flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger className="bg-emerald-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-emerald-600 transition-colors duration-300">
              {selectedCountry}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white text-black rounded-lg shadow-lg border border-gray-200 mt-2 w-56 overflow-hidden animate-fade-in">
              {countries.map((country) => (
                <DropdownMenuItem
                  key={country}
                  onClick={() => setSelectedCountry(country)}
                  className="px-4 py-2 cursor-pointer hover:bg-emerald-100 hover:text-emerald-700 transition-colors duration-200"
                >
                  {country}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Scholarship Sections */}
        {filteredData.map((countryData) => (
          <section key={countryData.country} className="mb-16">
            {selectedCountry === "All" && (
              <h2 className="text-3xl font-semibold mb-6">
                {countryData.country}
              </h2>
            )}
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {countryData.sites.map((site) => (
                <div
                  key={site.name}
                  className="border bg-emerald-200/90 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={site.imgUrl}
                      alt={site.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {site.name}
                      </h3>
                      <p className="text-gray-700 mb-4">{site.description}</p>
                    </div>
                    <div className="flex sm:flex-row flex-col  gap-3 mt-auto">
                      <a
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded transition"
                      >
                        Visit Website
                      </a>
                      <button
                        onClick={() => router.push("/mentors")}
                        className="flex-1 text-center border border-emerald-500 text-emerald-500 hover:bg-emerald-50 font-semibold py-2 px-4 rounded transition"
                      >
                        Ask Mentor
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* What We Offer Section */}
      <OurFeature />
    </div>
  );
}
