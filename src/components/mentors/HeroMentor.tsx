import SearchBelowHero from "./SearchBelowHero";
import { MentorProfileWithUser } from "../../../types/all-types";

export default function HeroMentors({mentors}:{mentors: MentorProfileWithUser[]}) {
  return (
    <section className="min-h-screen flex flex-col justify-start  items-center  sm:pt-auto pt-8">
        <div className="max-w-5xl mx-auto text-center py-20">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
          Your Trusted Mentors to Study in{" "}
          <span className="text-emerald-600">Japan</span> from{" "}
          <span className="text-emerald-600">Nepal</span>
        </h1>

        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          Helping Nepali students choose the right college, city, and future —
          with expert guidance from someone who&aops;s been there.
        </p>

        
      </div>
    
      <SearchBelowHero mentors={mentors}/>
    </section>
  );
}
