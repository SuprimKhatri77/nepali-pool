export default function Hero() {
  return (
    <section className="h-screen flex flex-col justify-start  items-center sm:pt-auto pt-12">
      <h1 className="text-3xl sm:text-4xl md:text-[46px] font-semibold sm:font-bold pb-8 sm:text-left text-center">
        Your Trusted Mentor to Study in <br className="hidden sm:block" />
        <div className="w-full md:w-[500px] sm:mx-auto text-center">
          <span className="text-[#b31f1f]">JAPAN</span> from{" "}
          <span className="text-[#e92424]">Nepal</span>
        </div>
      </h1>
      <div className="h-36 hidden sm:block">Icons here!</div>
      <div className="yellow-box rounded-[8px] bg-gradient-to-b p-4 px-6 from-[#F0B100] to-[#FFD357] max-w-80 w-full stroke-white stroke-2 text-[#1F1777] ">
        Helping Nepali students choose the right college, city, and future —
        with expert guidance from someone who&apos;s been there.
      </div>
      <div className="max-w-[500px] w-full mx-auto text-center mt-6">
        <h2 className="text-3xl sm:text-5xl font-bold text-[#e92424]">START</h2>
        <div className="cta flex justify-around text-base sm:text-xl font-semibold gap-4 sm:gap-10 mt-3">
          <button className="bg-[#FACC15] rounded-[10px] py-2 px-4 cursor-pointer">
            As a Mentor
          </button>
          <button className="bg-[#3a86ff] rounded-[10px] text-white py-2 px-4 cursor-pointer">
            As a Student
          </button>
        </div>
      </div>
    </section>
  );
}
