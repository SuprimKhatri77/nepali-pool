import Hero from "./landing/Hero";
import HowItWorks from "./landing/HowItWorks";
import WhyTrustUs from "./landing/WhyTrustuS";
// import Pricing from "./landing/Pricing";
import { Faq1 } from "./Faq";
import OurFeature from "./whatweoffer/OurFeature";
import { MessengerIcon } from "./landing/messenger-button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-emerald-200/90 min-w-full overflow-x-hidden">
      <Hero />
      <HowItWorks />
      <OurFeature />
      <WhyTrustUs />
      {/* <Pricing /> */}
      <Faq1 />
      {/* <SubscribeNewsLetter /> */}
      <MessengerIcon />
    </div>
  );
}
