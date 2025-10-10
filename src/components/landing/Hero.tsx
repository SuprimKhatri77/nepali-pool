import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
          Your Trusted Mentor to Study in{" "}
          <span className="text-emerald-600">Japan</span> from{" "}
          <span className="text-emerald-600">Nepal</span>
        </h1>

        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          Helping Nepali students choose the right college, city, and future —
          with expert guidance from someone who's been there.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Link
            href="/login"
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors shadow-sm"
          >
            Start as a Mentor
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 bg-white hover:bg-gray-50 text-emerald-600 font-semibold rounded-lg transition-colors shadow-sm border-2 border-emerald-600"
          >
            Start as a Student
          </Link>
        </div>
      </div>

      {/* <div className="mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 rounded-3xl blur-3xl opacity-30"></div>
          <Image
            src="/landing/hero.svg"
            alt="Hero illustration"
            height={300}
            width={800}
            className="relative rounded-2xl mx-auto h-64 max-w-4xl w-full"
          />
        </div>
      </div> */}
    </section>
  );
}
