import Image from "next/image";

// how it works card
export default function HowItWorksCard({
  Header,
  Content,
  img,
}: {
  readonly Header: string;
  readonly Content: string;
  readonly img: string;
}) {
  return (
    <div className="max-w-[270px] min-h-[310px] shadow-md w-full bg-gradient-to-b from-[#D9D9D9] via-[#706FA3] to-[#1e1a4d] from-0% via-0% to-100% rounded-[8px]  py-4 px-1">
      <div id="icon" className="m-5 flex items-center justify-center">
        <Image src={img} alt="how it works img" height={80} width={80} />
      </div>
      <div id="content" className="text-[#C2CDFF] p-5">
        <h4 className="mb-5 text-center font-semibold text-xl">{Header}</h4>
        <p className="text-white text-xs font-medium text-center mt-2">
          {Content}
        </p>
      </div>
    </div>
  );
}
