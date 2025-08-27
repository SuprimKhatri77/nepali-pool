import TrustedByCard from "../reusableComponents/TRUSTEDBY";

export default function TrustedBy() {
  return (
    <section className="bg-white text-black max-w-[90%] w-full px-8 shadow-md mx-auto min-h-screen pb-8 mb-8">
      <h1 className="text-3xl sm:text-4xl font-medium text-center py-4">
        Trusted By
      </h1>
      <hr className="border-2 border-yellow-400 w-12 mx-auto" />
      <div id="container" className="mt-3 flex gap-6 flex-wrap justify-center">
        {/* load cards here! */}
        <TrustedByCard Header="School" Count={20} />
        <TrustedByCard Header="Partner With" Count={20} />
        <TrustedByCard Header="Students" Count={20} />
        <TrustedByCard Header="Mentor" Count={20} />
      </div>
    </section>
  );
}
