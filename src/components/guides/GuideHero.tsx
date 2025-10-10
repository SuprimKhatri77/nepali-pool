import Image from "next/image";

export default function GuideHero() {
  return (
    <div className="flex flex-col justify-center items-center p-5 px-10 mx-auto">
      <h1 className=" sm:text-4xl text-3xl font-bold p-5">
        Steps to Apply <span className="text-[#B31F1F]">Japanese</span> Language
        School
      </h1>
      <Image
        src="/guides/guide1.png"
        alt="guide hero image"
        width={990}
        height={497}
      />
    </div>
  );
}
