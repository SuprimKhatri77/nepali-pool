import React from "react";

export default function SubscribeNewsLetter() {
  return (
    <section className="rounded-md mb-4 flex md:flex-row flex-col justify-around items-center bg-gradient-to-r py-6 px-6 from-[#413BA1] via-[#3A489D] to-[#384E9B] from-0% via-69% to-100% stroke-white stroke-2 text-[#1F1777] lg:mx-auto max-w-[1200px] mx-2 sm:mx-7">
      <div className="text-[#f5f5f5] w-full md:w-1/2">
        <h1 className="text-xl font-medium mb-3">
          Subscribe to our newsletter
        </h1>
        <p className="text-sm sm:text-base font-medium pr-6">
          Subscribe to our newsletter and unlock a world of exclusive benefits.
          Be the first to know about our latest products, special promotions,
          and exciting updates.{" "}
        </p>
      </div>
      <form className="flex gap-2 w-full md:w-1/2 md:mt-0 mt-4">
        <div className="flex  gap-2 w-full px-4  h-13 rounded-[8px] border-white border mt-2 relative">
          <input
            type="email"
            placeholder="Enter your email"
            className="outline-none text-white placeholder:text-white"
          />
          <button
            type="submit"
            className="bg-[#FACC15] hover:bg-[#ebc013] px-2 sm:px-4 py-1 sm:py-2 text-black absolute right-2 font-medium text-base rounded-[8px] cursor-pointer h-8 sm:h-10 sm:translate-y-1/3 top-[9] md:top-[-8]"
          >
            Subscribe
          </button>
        </div>
      </form>
    </section>
  );
}
