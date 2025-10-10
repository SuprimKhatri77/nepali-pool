import Image from "next/image";

export default function WhyTrustUs() {
  return (
    <section className="rounded-md bg-white text-black max-w-[90%] w-full px-8 shadow-md mx-auto min-h-auto my-10 py-10 flex flex-col md:flex-row gap-4">
      <div id="1" className="md:w-1/2">
        <h1 className="text-4xl font-medium text-center py-4">Why Trust Us?</h1>
        <hr className="border-2 border-yellow-400 w-12 mx-auto" />
        <div id="content" className="text-base xl:text-xl font-medium my-6">
          {/* repeat trusting content 4times */}
          <div className="flex justify-center items-center gap-4 mt-4">
            <Image src="/landing/tick.png" height={40} width={40} alt="tick" />
            <p className="text-sm sm:text-base md:text-lg text-black/80">
              Affordable mentorship by real Nepali students Get guidance from
              those who&apos;ve successfully navigated the process
            </p>
          </div>
          <div className="flex justify-center items-center gap-4 mt-4">
            <Image src="/landing/tick.png" height={0} width={40} alt="tick" />
            <p className="text-sm sm:text-base md:text-lg text-black/80">
              Affordable mentorship by real Nepali students Get guidance from
              those who&apos;ve successfully navigated the process
            </p>
          </div>
          <div className="flex justify-center items-center gap-4 mt-4">
            <Image src="/landing/tick.png" height={40} width={40} alt="tick" />
            <p className="text-sm sm:text-base md:text-lg text-black/80">
              Affordable mentorship by real Nepali students Get guidance from
              those who&apos;ve successfully navigated the process
            </p>
          </div>
          <div className="flex justify-center items-center gap-4 mt-4">
            <Image src="/landing/tick.png" height={40} width={40} alt="tick" />
            <p className="text-sm sm:text-base md:text-lg text-black/80">
              Affordable mentorship by real Nepali students Get guidance from
              those who&apos;ve successfully navigated the process
            </p>
          </div>
          <div className="flex justify-center items-center gap-4 mt-4">
            <Image src="/landing/tick.png" height={40} width={40} alt="tick" />
            <p className="text-sm sm:text-base md:text-lg text-black/80">
              Affordable mentorship by real Nepali students Get guidance from
              those who&apos;ve successfully navigated the process
            </p>
          </div>
        </div>
      </div>
      <div id="2" className="md:w-1/2">
        <h3 className="text-3xl font-medium text-center py-4">Testiomonials</h3>
        <hr className="border-2 border-yellow-400 w-12 mx-auto" />
        {/* repeat testimonial card 4times */}
        <div
          id="testimonial-card"
          className="max-w-[350px] flex items-center flex-col mt-3 bg-gradient-to-l from-[#D9D9D9] via-[#69439D] to-[#15023B] from-0% via-0% to-100% rounded-[8px]  px-4 py-8 mx-auto"
        >
          <div
            id="image-name"
            className="flex items-center justify-around gap-3"
          >
            <p className="w-12 h-12 rounded-full bg-black"></p>
            <p className="text-white">
              Name: <span>Roshan Pokharel</span>
            </p>
          </div>
          <div id="review" className="sm:px-0 px-2 pt-2 mt-3">
            <p className="text-[#d8d8d8] text-sm">
              I was skeptical at first, but the mentorship program turned out to
              be a game-changer. The guidance and support I received were
              invaluable, and I&apos;m grateful for the opportunity to learn
              from someone who&apos;s been there.
            </p>
          </div>
        </div>
        <div
          id="testimonial-card"
          className="max-w-[350px] flex items-center flex-col mt-3 bg-gradient-to-l from-[#D9D9D9] via-[#69439D] to-[#15023B] from-0% via-0% to-100% rounded-[8px]  px-4 py-8 mx-auto"
        >
          <div
            id="image-name"
            className="flex items-center justify-around gap-3"
          >
            <p className="w-12 h-12 rounded-full bg-black"></p>
            <p className="text-white">
              Name: <span>Roshan Pokharel</span>
            </p>
          </div>
          <div id="review" className="sm:px-0 px-2 mt-3 pt-2">
            <p className="text-[#d8d8d8] text-sm">
              I was skeptical at first, but the mentorship program turned out to
              be a game-changer. The guidance and support I received were
              invaluable, and I&apos;m grateful for the opportunity to learn
              from someone who&apos;s been there.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
