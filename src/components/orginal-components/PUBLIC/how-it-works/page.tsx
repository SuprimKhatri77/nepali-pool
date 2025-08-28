import React from "react";
import HowItWorksCard from "../reusableComponents/HITWCARD";

export default function HowItWorks() {
  return (
    <section className="bg-white  rounded-md text-black max-w-[90%] w-full px-8 shadow-md mx-auto min-h-screen pb-8 mb-8">
      <h1 className="text-3xl sm:text-4xl font-medium text-center py-4">
        How It Works
      </h1>
      <hr className="border-2 border-yellow-400 w-12 mx-auto" />
      <div id="container" className="mt-3 flex gap-6 flex-wrap justify-center">
        {/* load cards here! */}
        <HowItWorksCard
          img="/how1.png"
          Header="Visit NepaliPool.Com"
          Content="Create your account and explore our partner schools in Japan and Korea."
        />
        <HowItWorksCard
          img="/how2.png"
          Header="Choose
  Support Option"
          Content="Select from free resources or premium mentorship packages."
        />
        <HowItWorksCard
          img="/how3.png"
          Header="Submit Application"
          Content="We help you complete all documents and submit to your Choosen Schools"
        />
        <HowItWorksCard
          img="/how4.png"
          Header="     Get Offer
 Letter & Visa"
          Content="Receive acceptance and we guide you through the visa process."
        />
        <HowItWorksCard
          img="/how5.png"
          Header="Fly & Become 
    a Mentor"
          Content="We help you complete all documents and submit to your Choosen Schools"
        />
      </div>
    </section>
  );
}
