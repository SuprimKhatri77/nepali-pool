import Hero from "@/components/orginal-components/PUBLIC/hero/Hero";
import HowItWorks from "@/components/orginal-components/PUBLIC/how-it-works/page";
import SubscribeNewsLetter from "@/components/orginal-components/PUBLIC/SubscribeNewsLetter/page";
import WhyTrustUs from "@/components/orginal-components/PUBLIC/WhyTrustUs/page";

export default function HomePage() {
  return (
    <main className="bg-gradient-to-l from-0% from-[#BEDFFF] via-52% via-[#DEE9FF] to-100% to-[#bedfff] mb-4">
      <Hero />
      <HowItWorks />
      <WhyTrustUs />
      <SubscribeNewsLetter />
    </main>
  );
}
