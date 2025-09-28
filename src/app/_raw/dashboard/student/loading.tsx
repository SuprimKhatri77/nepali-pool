"use client";

export default function LoadingPage() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full">
      <div className="inline-block border-orange-600 h-4 w-4 animate-spin rounded-full border-2 border-solid border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
