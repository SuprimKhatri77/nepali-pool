// how it works card
export default function HowItWorksCard({
  Header,
  Content,
}: {
  readonly Header: string;
  readonly Content: string;
}) {
  return (
    <div className="max-w-[330px]  w-full bg-gradient-to-b from-[#D9D9D9] via-[#706FA3] to-[#1e1a4d] from-0% via-0% to-100% rounded-[8px]  p-4">
      <div id="icon" className="flex items-center justify-center">
        icon here ?
      </div>
      <div id="content" className="text-[#C2CDFF]">
        <h4 className="text-center font-semibold text-xl">{Header}</h4>
        <p className="text-white text-xs font-medium text-center mt-2">
          {Content}
        </p>
      </div>
    </div>
  );
}
