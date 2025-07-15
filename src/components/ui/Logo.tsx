import Image from "next/image";

const Logo = () => {
  return (
    <div className="relative group w-full flex flex-wrap justify-center items-center gap-1 pt-2">
      <div className="relative w-[30%] h-auto">
        <div className="absolute top-4 left-0 w-full h-[1px] bg-black"></div>
      </div>
      <Image
        src="/logo.png"
        alt="signup"
        width={70}
        height={80}
        className="transition duration-700 ease-in-out"
      />
      <div className="relative w-[30%] h-auto">
        <div className="absolute top-4 right-0 w-full h-[1px] bg-black"></div>
      </div>
    </div>
  );
};

export default Logo;
