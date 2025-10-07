export default function Loader({
  borderColor,
  from,
}: {
  borderColor?: string;
  from?: string;
}) {
  return (
    <div
      className={`inline-block ${from === "respond" || from === "schedule" ? "border-red-500" : "border-indigo-500"} h-4 w-4 animate-spin rounded-full border-2 border-solid border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white`}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
