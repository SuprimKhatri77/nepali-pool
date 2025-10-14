import Image from "next/image";

export default function GuideHero() {
  return (
    <div className="flex flex-col justify-center items-center px-6 py-16 md:py-24 ">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
          Steps to Apply{" "}
          <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
            Japanese
          </span>{" "}
          Language School
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Your comprehensive guide to studying in Japan
        </p>
      </div>
    </div>
  );
}
