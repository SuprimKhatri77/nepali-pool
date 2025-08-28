export default function HeroSchool() {
  return (
    <section className="h-screen flex flex-col justify-start  items-center sm:pt-auto pt-12">
      <h1 className="text-3xl sm:text-4xl md:text-[46px] font-semibold sm:font-bold pb-8 sm:text-left text-center">
        Your Trusted Schools to Study in <br className="hidden sm:block" />
        <div className="w-full md:w-[500px] sm:mx-auto text-center">
          <span className="text-[#b31f1f]">JAPAN</span> from{" "}
          <span className="text-[#e92424]">Nepal</span>
        </div>
      </h1>
      <div className="h-36 hidden sm:block relative">
        Image here!
        <hr className="border-1 border-white-400 w-[612px] absolute right-[290px] top-24 rotate-90" />
        <hr className="border-1 border-white-400 w-[612px] absolute right-[275px] top-24 rotate-90" />
        <hr className="border-1 border-white-400 w-[1112px] absolute  top-8 rotate-[25deg] -right-[480px]" />
        <hr className="border-1 border-white-400 w-[1112px] absolute  top-6 rotate-[25deg] -right-[520px]" />
      </div>
      <div className="  text-center mt-6">
        <div
          id="search"
          className="flex justify-between gap-6 max-w-[500px] w-full mx-auto mt-6"
        >
          <input
            type="text"
            placeholder="Search for Schools"
            className="w-full rounded-[10px] py-2 px-4 stroke-[#BABABA] stroke-2 bg-white"
          />
          <button className="rounded-[10px] py-2 px-4 cursor-pointer stroke-[#BABABA] stroke-2 bg-white w-[104px]">
            Filter
          </button>
        </div>
        <div className="cta flex justify-around text-white text-base sm:text-xl font-semibold gap-4 sm:gap-10 mt-3">
          <button className="w-[270px] h-[45px] mt-4 bg-gradient-to-r from-[#61050B] to-[#C30009]  rounded-[10px] py-2 px-4 cursor-pointer">
            Country
          </button>
          <button className="w-[270px] h-[45px] mt-4 bg-gradient-to-r from-[#2F0D68] to-[#7F22FE] rounded-[10px]  py-2 px-4 cursor-pointer">
            City
          </button>
          <button className="w-[270px] h-[45px] mt-4 bg-gradient-to-r from-[#861043] to-[#F6339A] rounded-[10px] py-2 px-4 cursor-pointer">
            Price
          </button>
          <button className="w-[270px] h-[45px] mt-4 bg-gradient-to-r from-[#3C0366] to-[#9810FA] rounded-[10px] py-2 px-4 cursor-pointer">
            Top Rated
          </button>
        </div>
      </div>
    </section>
  );
}
