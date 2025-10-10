import React from "react";
import HowItWorksCard from "./resuable/HITWcard";

export default function HowItWorks() {
  return (
    <section className="bg-white  rounded-md text-black max-w-[90%] w-full px-12 shadow-md mx-auto min-h-auto pb-10 mb-10">
      <h1 className="text-3xl sm:text-4xl font-medium text-center py-4">
        How It Works
      </h1>
      <hr className="w-30 h-1 bg-gradient-to-r from-[#ffffff] via-[#D83A0A] to-[#ffffff] mx-auto" />
      <div
        id="container"
        className="mt-3 flex gap-y-4 gap-x-16 flex-wrap justify-center"
      >
        {/* load cards here! */}
        <HowItWorksCard
          img="/landing/how1.png"
          Header="Visit NepaliPool.Com"
          Content="Create your account and explore our partner schools in Japan and Korea."
        />
        <HowItWorksCard
          img="/landing/how2.png"
          Header="Choose
  Support Option"
          Content="Select from free resources or premium mentorship packages."
        />
        <HowItWorksCard
          img="/landing/how3.png"
          Header="Submit Application"
          Content="We help you complete all documents and submit to your Choosen Schools"
        />
        <HowItWorksCard
          img="/landing/how4.png"
          Header="     Get Offer
 Letter & Visa"
          Content="Receive acceptance and we guide you through the visa process."
        />
        <HowItWorksCard
          img="/landing/how5.png"
          Header="Fly & Become 
    a Mentor"
          Content="We help you complete all documents and submit to your Choosen Schools"
        />
      </div>
    </section>
  );
}
