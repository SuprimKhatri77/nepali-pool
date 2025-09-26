type GuideParaCardProps = {
  step: number | string;
  title: string;
  description: string;
  isLast?: boolean;
  ul?: string[];
};

export default function GuideParaCard({
  step,
  title,
  description,
  isLast = false,
  ul = [],
}: GuideParaCardProps) {
  const li: string[] = [];
  if (ul.length > 0) {
    for (const list of ul) {
      li.push(list);
    }
  }
  return (
    <div className="flex flex-col items-start relative px-8 pt-5">
      <div className="flex flex-col items-center absolute left-0 h-full">
        <svg className="h-5 w-5">
          <circle
            cx="10"
            cy="10"
            r="5"
            className="stroke-black stroke-1 fill-[#3A86FF]"
          />
        </svg>
        {!isLast && (
          <div className="absolute w-[2px] h-full bg-black flex-1 mt-0 top-[15]" />
        )}
      </div>
      <span className="text-base">step {step}</span>
      <h1 className="text-[#3A86FF] text-lg font-semibold">{title}</h1>
      <p className="text-sm">{description}</p>
      {li.length > 0 && (
        <ul className="pl-5">
          {li.map((list, key) => (
            <li className="list-disc" key={key}>
              {list}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
