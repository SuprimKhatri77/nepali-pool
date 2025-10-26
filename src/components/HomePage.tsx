import Hero from "./landing/Hero";
import HowItWorks from "./landing/HowItWorks";
import WhyTrustUs from "./landing/WhyTrustuS";
// import Pricing from "./landing/Pricing";
import SubscribeNewsLetter from "./landing/NewsLetter";
import { Faq1 } from "./Faq";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 min-w-full overflow-x-hidden">
      {/* <AnnouncementBanner /> */}
      <Hero />
      <HowItWorks />
      <WhyTrustUs />
      {/* <Pricing /> */}
      <Faq1 />
      <SubscribeNewsLetter />
    </div>
  );
}
