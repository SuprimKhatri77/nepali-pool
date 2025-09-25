import { db } from "../../../../../lib/db";
import { MentorProfileSelectType } from "../../../../../lib/db/schema";
import MentorCard from "./MentorSpecific/reusable/MentorCard";

export default async function MentorList() {
  const mentors: MentorProfileSelectType[] =
    await db.query.mentorProfile.findMany({
      with: {
        user: true,
      },
    });
  return (
    <section className="bg-white text-black max-w-[90%] w-full px-8 shadow-md mx-auto min-h-screen pb-8 mb-8">
      <h1 className="text-3xl sm:text-4xl font-medium text-center py-4">
        {"Mentor List"}
      </h1>
      <hr className="border-2 border-yellow-400 w-12 mx-auto" />
      <div id="container" className="mt-6 flex gap-12 flex-wrap justify-center">
        {/* load cards here! */}
        {mentors.map((school, i) => {
          return <MentorCard {...school} key={i + 1} />;
        })}
      </div>
    </section>
  );
}
