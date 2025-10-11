"use client"

import SearchBelowHero from "./SearchBelowHero";
import { SchoolSelectType } from "../../../../lib/db/schema";
import { Link } from "lucide-react";

export default  function HeroSchool({schools}:{schools: SchoolSelectType[]}) {

  return (
    <>
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
          Your Trusted School to Study in{" "}
          <span className="text-emerald-600">Japan</span> from{" "}
          <span className="text-emerald-600">Nepal</span>
        </h1>

        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          Helping Nepali students choose the right school, city, and future —
          with expert guidance from someone who&apos;s been there.
        </p>

       
      </div>

     
      <SearchBelowHero schools={schools} />
    </section>
    </>
  )
}
