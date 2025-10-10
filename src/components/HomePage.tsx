import Image from "next/image";
import Link from "next/link";
import Header from "./landing/Header";
import Hero from "./landing/Hero";
import HowItWorks from "./landing/HowItWorks";
import WhyTrustUs from "./landing/WhyTrustuS";
import Pricing from "./landing/Pricing";
import SubscribeNewsLetter from "./landing/NewsLetter";
import Footer from "./landing/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      <HowItWorks />
      <WhyTrustUs />
      <Pricing />
      <SubscribeNewsLetter />
      <Footer />
    </div>
  );
}
