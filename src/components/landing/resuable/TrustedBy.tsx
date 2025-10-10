import Image from "next/image";

export default function TrustedByCard({
  Header,
  Count,
  img,
}: {
  readonly Header: string;
  readonly Count: number;
  readonly img: string;
}) {
  return (
    <div className="max-w-[500px] min-h-[300px] shadow-md w-full rounded-xl bg-gradient-to-b from-[#E9F3FF]  to-[#AAAEC8] from-0%  to-100% flex items-center justify-center flex-col">
      <div className="mb-3 ">
        <Image src={img} alt="imagebytrust" height={128} width={128} />
        <p className="text-xl text-center font-medium">{Header}</p>
      </div>
      <div>
        <h1 className="text-5xl font-bold">{Count}+</h1>
      </div>
    </div>
  );
}
