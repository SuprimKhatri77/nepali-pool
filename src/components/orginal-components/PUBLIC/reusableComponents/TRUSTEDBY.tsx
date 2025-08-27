export default function TrustedByCard({
  Header,
  Count,
}: {
  readonly Header: string;
  readonly Count: number;
}) {
  return (
    <div className="card min-w-[500px] h-[300px] rounded-2xl bg-gradient-to-b from-[#E9F3FF]  to-[#AAAEC8] from-0%  to-100% flex items-center justify-center flex-col">
      <div className="mb-3 ">
        <p>Icon Here?</p>
        <p className="text-xl font-medium">{Header}</p>
      </div>
      <div>
        <h1 className="text-5xl font-bold">{Count}+</h1>
      </div>
    </div>
  );
}
