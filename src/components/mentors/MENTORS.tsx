import Image from "next/image";

export default function HeroMentors() {
  return (
    <section className="min-h-screen flex flex-col justify-start  items-center  sm:pt-auto pt-8">
      <h1 className="text-3xl  xl:text-[46px] font-semibold sm:font-bold pb-2 sm:text-left text-center">
        Your Trusted Mentors to Study in <br className="hidden sm:block" />
        <div className="w-full md:w-[500px] sm:mx-auto text-center">
          <span className="text-[#b31f1f]">JAPAN</span> from{" "}
          <span className="text-[#e92424]">Nepal</span>
        </div>
      </h1>
      <Image
        src={"/mentorListPage/hero.svg"}
        alt="hero secton image"
        height={260}
        width={511}
        className="sm:px-0 px-4 mb-0 mt-2
            "
      />
      <div className="text-center mt-3 sm:mt-1">
        <div
          id="search"
          className="flex justify-between gap-6 max-w-[500px] w-full mx-auto mt-2 px-4"
        >
          <input
            type="text"
            placeholder="Search for Schools"
            className="w-full rounded-[10px] py-2 px-4 stroke-[#BABABA] stroke-2 bg-white"
          ></input>
          <span className="w-4 h-4 mt-1">
            <Image
              src={"/allSchoolPage/filter.svg"}
              alt="hero secton image"
              height={20}
              width={20}
              className="w-4 h-4"
            />
          </span>
          <button className="rounded-[10px] flex justify-center items-center gap-3 py-2 px-4 cursor-pointer stroke-[#BABABA] stroke-2 bg-white w-[104px]">
            Filter
            <span className="w-4 h-4 mt-1">
              <Image
                src={"/allSchoolPage/filter.svg"}
                alt="hero secton image"
                height={20}
                width={20}
                className="w-4 h-4"
              />
            </span>
          </button>
        </div>
        <div className="cta flex flex-wrap justify-around text-white text-base sm:text-xl font-semibold gap-4 sm:gap-10 mb-3">
          <button className="w-[100px] sm:w-[270px] h-[45px] mt-4 bg-gradient-to-r from-[#61050B] to-[#C30009]  rounded-[10px] py-2 px-4 cursor-pointer">
            Country
          </button>
          <button className="w-[100px] sm:w-[270px] h-[45px] mt-4 bg-gradient-to-r from-[#2F0D68] to-[#7F22FE] rounded-[10px]  py-2 px-4 cursor-pointer">
            City
          </button>
          <button className="w-[140px] sm:w-[270px] h-[45px] mt-4 bg-gradient-to-r from-[#861043] to-[#F6339A] rounded-[10px] py-2 px-4 cursor-pointer">
            Price
          </button>
          <button className="w-[140px] sm:w-[270px] h-[45px] mt-4 bg-gradient-to-r from-[#3C0366] to-[#9810FA] rounded-[10px] py-2 px-4 cursor-pointer">
            Top Rated
          </button>
        </div>
      </div>
      <div className="h-36 hidden sm:block relative">
        <hr className="border-1 border-white-400 w-[612px] absolute right-[290px] top-24 rotate-90" />
        <hr className="border-1 border-white-400 w-[612px] absolute right-[275px] top-24 rotate-90" />
        <hr className="border-1 border-white-400 w-[1112px] absolute  top-8 rotate-[25deg] -right-[480px]" />
        <hr className="border-1 border-white-400 w-[1112px] absolute  top-6 rotate-[25deg] -right-[520px]" />
      </div>
    </section>
  );
}
