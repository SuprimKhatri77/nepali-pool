import Image from "next/image";
export default function Hero() {
  return (
    <section className="bg-transparent h-auto mb-10 flex flex-col justify-start  items-center sm:pt-auto pt-10">
      <h1 className="text-shadow-xs text-2xl sm:text-4xl md:text-[40px] font-semibold sm:font-bold pb-5 sm:text-left text-center">
        Your Trusted Mentor to Study in <br className="hidden sm:block" />
        <div className="w-full md:w-[500px] text-shadow-xs sm:mx-auto text-center">
          <span className="text-[#b31f1f] text-shadow-xs">JAPAN</span> from{" "}
          <span className="text-[#e92424] text-shadow-xs">Nepal</span>
        </div>
      </h1>
      <div className="m-5 h-36 hidden sm:block">
        <Image
          src="/landing/hero.svg"
          alt="hero secton image"
          height={230}
          width={800}
        />
      </div>
      <div className="text-sm m-5 yellow-box rounded-[8px] bg-gradient-to-b p-3 px-5 shadow-xl from-[#F0B100]  to-[#fad366] max-w-80 w-full stroke-white stroke-2 text-[#1F1777] ">
        Helping Nepali students choose the right college, city, and future —
        with expert guidance from someone who&apos;s been there.
      </div>
      <div className="max-w-[500px] w-full mx-auto text-center mt-1">
        <h2 className="text-3xl sm:text-5xl font-bold text-[#e92424]">START</h2>
        <div className="cta flex justify-around text-base sm:text-xl font-semibold gap-4 sm:gap-10 mt-2">
          <button className="m-5 bg-[#FACC15] rounded-[10px] py-2 px-4 cursor-pointer shadow-xs">
            As a Mentor
          </button>
          <button className="m-5 bg-[#3a86ff] rounded-[10px] text-white py-2 px-2 cursor-pointer shadow-xs">
            As a Student
          </button>
        </div>
      </div>
    </section>
  );
}
