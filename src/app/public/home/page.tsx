import Hero from "@/components/orginal-components/PUBLIC/hero/Hero";
import HowItWorks from "@/components/orginal-components/PUBLIC/how-it-works/page";
import Pricing from "@/components/orginal-components/PUBLIC/pricing/page";
import SubscribeNewsLetter from "@/components/orginal-components/PUBLIC/SubscribeNewsLetter/page";
import TrustedBy from "@/components/orginal-components/PUBLIC/trustedBy/page";
import WhyTrustUs from "@/components/orginal-components/PUBLIC/WhyTrustUs/page";

export default function HomePage() {
  return (
    <main className="bg-transparent min-h-screen mx-auto mb-4">
      <Hero />
      <HowItWorks />
      <TrustedBy/>
      <WhyTrustUs />
      <Pricing />
      <SubscribeNewsLetter />
    </main>
  );
}
