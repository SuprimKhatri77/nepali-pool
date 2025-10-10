import TrustedByCard from "./resuable/TrustedBy";

export default function TrustedBy() {
  return (
    <section className="bg-white text-black max-w-[90%] w-full px-8 shadow-md mx-auto min-h-auto pb-10 mb-10">
      <h1 className="text-3xl sm:text-4xl font-medium text-center py-4">
        Trusted By
      </h1>
      <hr className="w-30 h-1 bg-gradient-to-r from-[#ffffff] via-[#D83A0A] to-[#ffffff] mx-auto" />
      <div id="container" className="mt-3 flex gap-16 flex-wrap justify-center">
        {/* load cards here! */}
        <TrustedByCard img="/school.svg" Header="School" Count={20} />
        <TrustedByCard img="/partner.svg" Header="Partner With" Count={20} />
        <TrustedByCard img="/student.svg" Header="Students" Count={20} />
        <TrustedByCard img="/mentor.svg" Header="Mentor" Count={20} />
      </div>
    </section>
  );
}
